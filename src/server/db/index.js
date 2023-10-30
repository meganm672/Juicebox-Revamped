

const prisma = require("../../../client")

/**
 * USER Methods
 */
/**
 * POST Methods
 */




/**
 * TAG Methods
 */


async function getAllTags() {
    try {
        const tags = await prisma.tags.findMany();

        return tags
    } catch (error) {
        throw error;
    }
}

module.exports = {
 

    getAllTags,
}