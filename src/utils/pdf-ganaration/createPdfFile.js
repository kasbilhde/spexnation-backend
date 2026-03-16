import generateOrderPdf from "./generateOrderPdf.js";

const createPdfFile = async (order, orderID, paymentStatus) => {

    const file = await generateOrderPdf(order, orderID, paymentStatus);
    return file;
};

export default createPdfFile;