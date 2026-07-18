const FileManager = require("./FileManager");

class Verifier {

    verify(categories) {

        const report = [];

        let totalFiles = 0;
        let missingFiles = 0;

        for (const category of categories) {

            const installed =
                FileManager.count(category.name);

            const missing =
                Math.max(
                    0,
                    category.total - installed
                );

            report.push({

                name: category.name,

                installed,

                expected: category.total,

                missing

            });

            totalFiles += installed;
            missingFiles += missing;

        }

        return {

            report,

            totalFiles,

            missingFiles

        };

    }

}

module.exports = new Verifier();