import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import capitalizeFirstLetter from "./capitalizeFirstLetter.js";




import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


async function generateOrderPdf(data, orderID, paymentStatus) {

    const doc = new jsPDF({ unit: "pt", format: "a4" });

    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 40;
    const contentW = pageW - margin * 2;

    let y = 50;

    // Helper: check if y is beyond page height, add page if needed
    const checkAddPage = () => {
        if (y > pageH - 50) {
            doc.addPage();
            y = 50;
        }
    };

    // ── BRANDING HEADER ──────────────────────────────
    const logoPath = path.join(__dirname, "../../assest/logo.png");
    const logoBase64 = fs.readFileSync(logoPath, { encoding: "base64" });
    const logo = `data:image/png;base64,${logoBase64}`;
    doc.addImage(logo, "PNG", 30, 30, 180, 60);

    // Client Info Box
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    let clientY = 35;

    [
        `Client Name: ${data?.fullname || ""}`,
        `Email: ${data?.email || ""}`,
        `Address1: ${data?.address1 || ""}`,
        `Address2: ${data?.address2 || ""}`,
        `City: ${data?.city || ""}  State: ${data?.state || ""}`,
        `Zipcode: ${data?.zipcode || ""}  Country: ${data?.country || ""}`,
    ].forEach((textLine) => {
        doc.text(textLine, pageW - 40, clientY, { align: "right" });
        clientY += 14;
    });
    doc.text(`Order ID: ${orderID || ""}`, 40, clientY, { align: "left" });
    clientY += 14;
    doc.text(`Payment Status: ${paymentStatus == "paid" ? "Paid" : "Unpaid"}`, 40, clientY, { align: "left" });
    clientY += 14;
    doc.text(`Total Items: ${data?.items?.length}`, 40, clientY, { align: "left" });
    clientY += 14;


    y += 130;

    // SUBTITLE
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(30, 30, 30);
    doc.text("Order Details", pageW / 2, y, { align: "center" });
    y += 30;


    // ── ORDER ITEMS ──────────────────────────────
    data?.items?.forEach((item, i) => {
        checkAddPage();

        if (item?.type === "Frame") {
            const singleItemData = item?.AllLensInfo;

            y += 5;

            // Draw red horizontal bar
            const barHeight = 20; // height of the bar
            doc.setFillColor(209, 172, 108); // red background
            doc.rect(40, y, pageW - 80, barHeight, "F"); // "F" = fill rectangle

            // Add white text on top
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.setTextColor(255, 255, 255); // white text
            doc.text(`Frame`, pageW / 2, y + barHeight / 2 + 4, { align: "center" });

            // Move y below the bar for next content
            y += barHeight + 15;

            // SECTION LABEL
            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            doc.setTextColor(100, 120, 140);
            doc.text("Prescription Details", 40, y);
            y += 10;

            // PRESCRIPTION TABLE
            const rxHead = [["Eyes", "SPH", "CYL", "Axis", "ADD", singleItemData.pdType == "1" ? "S-PD" : "D-PD"]];
            const isDualPD = singleItemData.pdType == "2";

            const odRow = ["Right (OD)", singleItemData?.sph?.rightSph, singleItemData?.cyl?.rightCyl, singleItemData?.axis?.rightAxis, singleItemData?.add?.rightAdd];
            const osRow = ["Left (OS)", singleItemData?.sph?.leftSph, singleItemData?.cyl?.leftCyl, singleItemData?.axis?.leftAxis, singleItemData?.add?.leftAdd];

            if (!isDualPD) {
                odRow.push({ content: singleItemData?.singlePD, rowSpan: 2 });
            } else {
                odRow.push(singleItemData?.dualPD?.rightPD);
                osRow.push(singleItemData?.dualPD?.leftPD);
            }

            const rxBody = [odRow, osRow];

            autoTable(doc, {
                startY: y,
                head: rxHead,
                body: rxBody,
                theme: "grid",
                margin: { left: 40, right: 40 },
                headStyles: { fillColor: [245, 245, 245], textColor: [40, 40, 40], fontStyle: "bold", halign: "center", fontSize: 10 },
                bodyStyles: { halign: "center", textColor: [50, 50, 50], fontSize: 10 },
                columnStyles: { 0: { halign: "center", fontStyle: "bold" } },
                styles: { lineColor: [200, 200, 200], lineWidth: 0.5 },
            });

            y = doc.lastAutoTable.finalY + 20;

            // PRISM TABLE (optional)
            if (singleItemData?.addPrism) {
                const prismHead = [["Eyes", "Vertical Prism", "Base Direction", "Horizontal Prism", "Base Direction"]];
                const prismBody = [
                    ["Right (OD)", singleItemData?.rightPrism?.vertical, singleItemData?.rightPrism?.vBaseDirection, singleItemData?.rightPrism?.horizontal, singleItemData?.rightPrism?.hBaseDirection],
                    ["Left (OS)", singleItemData?.leftPrism?.vertical, singleItemData?.leftPrism?.vBaseDirection, singleItemData?.leftPrism?.horizontal, singleItemData?.leftPrism?.hBaseDirection],
                ];

                autoTable(doc, {
                    startY: y,
                    head: prismHead,
                    body: prismBody,
                    theme: "grid",
                    margin: { left: 40, right: 40 },
                    headStyles: { fillColor: [245, 245, 245], textColor: [40, 40, 40], fontStyle: "bold", halign: "center", fontSize: 10 },
                    bodyStyles: { halign: "center", textColor: [50, 50, 50], fontSize: 10 },
                    columnStyles: { 0: { halign: "center", fontStyle: "bold" } },
                    styles: { lineColor: [200, 200, 200], lineWidth: 0.5 },
                });

                y = doc.lastAutoTable.finalY + 20;
            }

            // LINE ITEMS
            singleItemData.total.forEach((lineItem) => {
                checkAddPage();
                doc.setFont("helvetica", "normal");
                doc.text(lineItem?.target, 40, y);
                doc.text(` : ${lineItem?.name}`, 150, y);
                doc.text(`£${lineItem?.price}`, pageW - 40, y, { align: "right" });

                if (lineItem?.target === "Tints") {
                    y += 20;
                    doc.text("Colour", 40, y);
                    doc.text(` : ${lineItem?.name === "Sunglasses" ? capitalizeFirstLetter(singleItemData?.color) : singleItemData?.color}`, 150, y);
                    if (lineItem?.name === "Sunglasses") {
                        y += 20;
                        doc.text("Darkness", 40, y);
                        doc.text(` : ${capitalizeFirstLetter(singleItemData?.darkness)}`, 150, y);
                    }
                }

                y += 20;
            });
        } else {

            y += 5;

            // Draw red horizontal bar
            const barHeight = 20; // height of the bar
            doc.setFillColor(209, 172, 108); // red background
            doc.rect(40, y, pageW - 80, barHeight, "F"); // "F" = fill rectangle

            // Add white text on top
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.setTextColor(255, 255, 255); // white text
            doc.text(`Accessories`, pageW / 2, y + barHeight / 2 + 4, { align: "center" });

            // Move y below the bar for next content
            y += barHeight + 15;

            // // SECTION LABEL
            // doc.setFont("helvetica", "normal");
            // doc.setFontSize(11);
            // doc.setTextColor(100, 120, 140);
            // doc.text("Accessories Details:", 40, y);


            y += 5;
            doc.setFont("helvetica", "normal");
            doc.setTextColor(100, 120, 140);
            doc.setFontSize(11);
            doc.text("Proudct Type", 40, y);
            doc.text(` : ${item?.type}`, 150, y);
            y += 20;
            doc.text("Proudct Name", 40, y);
            doc.text(` : ${item?.name}`, 150, y);
            y += 20;
            doc.text("Proudct Price", 40, y);
            doc.text(` : £${item?.price}`, 150, y);
            y += 20;
            doc.text("Proudct Quentity", 40, y);
            doc.text(` : ${item?.quantity}`, 150, y);
            y += 20;
            doc.text("Total Price", 40, y);
            doc.text(` : £${item?.price * item?.quantity}`, 150, y);
            y += 20;
            doc.text("Description", 40, y);
            doc.text(` : ${item?.description}`, 150, y);
            y += 20;

        }
    });

    // ── TOTALS SECTION ──────────────────────────────
    checkAddPage();


    y += 20;

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.7);
    doc.line(40, y, pageW - 40, y);
    y += 20;

    if (data?.iscoupon) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text("Subtotal", 40, y);
        doc.text(`£${data?.subtotal}`, pageW - 40, y, { align: "right" });
        y += 18;

        doc.text(`Coupon Discount (${data?.coupondiscountPercentage}%)`, 40, y);
        doc.text(`£${data?.discountPrice}`, pageW - 40, y, { align: "right" });
        y += 20;

        doc.line(40, y, pageW - 40, y);
        y += 18;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Total", 40, y);
    doc.text(`£${data?.PaymentTotal}`, pageW - 40, y, { align: "right" });

    const base64 = doc.output("datauristring").split(",")[1];
    return base64;
}

export default generateOrderPdf;