const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncErrors")
const ApiFeatures = require("../utils/apifeatures")


// find all products
exports.getAllProducts = catchAsyncError(async (req, res,next) => {
    const resultPerPage = 5
    const productCount = await Product.countDocuments()
    const apifeatures = new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage)
    const products = await Product.find();
    res.status(200).json({
        success:true,
        products,
    })
})

// find single product details
exports.getSingleProduct = catchAsyncError(async (req, res, next) => {

    let product = await Product.findById(req.params.id)

    if(!product){
        return next(new ErrorHander("product not found",404))
    }
    res.status(200).json({
        success:true,
        productCount,
        product
    })
})

// create product 
exports.createProduct = catchAsyncError(async (req,res,next) => {
    const product = await Product.create(req.body)
    res.status(200).json({
        success:true,
        product
    })
})



// update product 
exports.updateProduct = catchAsyncError(async (req, res, next) => {

    let product = await Product.findById(req.params.id)
    if(!product){
        return next(new ErrorHander("product not found",404))
        // return res.status(500).json({
        //     success:false,
        //     message:"Product not found"
        // })
    }
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });
    res.status(200).json({
        success:true,
        product
    })
}
)
// DELETE PRODUCT
exports.deleteProduct = catchAsyncError(async (req, res, next) => {

    let product = await Product.findById(req.params.id)
    if(!product){
        return next(new ErrorHander("product not found",404))
        // return res.status(500).json({
        //     success:false,
        //     message:"Product not found"
        // })
    }
    await product.remove();
    res.status(200).json({
        success:true,
        message:"Product are deleted"
    })
})