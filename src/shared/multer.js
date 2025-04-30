import multer from "multer";
import * as fs from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = './uploads';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

export const upload = multer({ storage: storage });


export function deleteFiles(images = []){
  const path = join(__dirname, '../', '../',)
  images.forEach( async(image) => {
     fs.unlinkSync(join(path, image))
  })
}
