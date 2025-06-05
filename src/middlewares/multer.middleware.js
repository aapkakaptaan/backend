import multer from "multer"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "C:\\Users\\KIIT\\OneDrive\\Desktop\\New folder (2)\\day4\\public\\temp");

    },
    filename: (req, file, cb) => {

        cb(null, file.originalname)
    }
})

export const upload = multer({
    storage,
})