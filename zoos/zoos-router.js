const express = require("express")
const db = require("../data/config")

const router = express.Router()

router.get("/", async (req, res, next) => {
	try {
		res.json(await db("zoos"))
	} catch(err) {
		next(err)
	}
})

router.get("/:id", async (req, res, next) => {
	try {
		const zoo = await db("zoos")
			.where("id", req.params.id)
			.first()
		
		if (!zoo) {
			return res.status(404).json({
				message: "Zoo not found",
			})
		}

		res.json(zoo)
	} catch(err) {
		next(err)
	}
})

// this end point is to get a list of animals that have ever been at the zoo
router.get('/:id/animals', async (req, res, next) => {
	try {
		// we're going to store the query to the zoos animal join table
		const animals = await db('zoos_animals as za')
			.join("zoos as z", 'z.id', 'za.zoo_id') // this joins in our zoos id
			.join('animals as a', 'a.id', 'za.animal_id') // this joins in our animals id
			.join("species as s", "s.id", "a.species_id") // this joins in the species table, 
			.where('za.id', req.params.id) // we are going to select everything where the zoo id is equal to the parameter from the url
			.select('a.*', "s.name as species_name", 'za.from_date', 'za.to_date') // the select method selects everything from the animal's table and then select both dates from the join table. 

			res.json(animals)
	} catch(err){
		next(err)
	}
})
module.exports = router