// routes/productRoute.js
import express from 'express';
import multer from 'multer';
import { addProduct, getProducts,getProductById ,deleteProduct} from '../controller/productController.js';

const productRouter = express.Router();

// Image storage
const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

productRouter.post('/add', upload.single('image'), addProduct);
productRouter.get('/list', getProducts);
productRouter.get('/:id', getProductById);
productRouter.delete("/delete/:id", deleteProduct);


export default productRouter;
