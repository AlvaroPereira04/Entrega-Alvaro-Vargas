const fs = require('fs')


class FileManager {
    constructor(archivo) {
        this.archivo = archivo
    }

    writeFile = async archivo => {
        try {
            await fs.promises.writeFile(
                this.path, JSON.stringify(data, null, 2)
                )
            }catch(err) {
            console.log(err);
            }
    }
    readFile = async archivo => {
        try {
            /* leo el archivo */
            const data = await fs.promises.readFile(this.archivo);
            return JSON.parse(data);
        } catch (error) {
            console.log(`Error reading the file: ${error.message}`);
        }
    }
}

module.export = FileManager