/* Import faunaDB sdk */
const process = require('process')

const { query, Client } = require('faunadb')

const client = new Client({
	secret: process.env.FAUNADB_SERVER_SECRET,
})

const handler = async (event, userMail) => {
	const { id } = event
	console.log(`Function 'delete' invoked. delete id: ${id}`)
	return client
	.query(query.Get(query.Ref(`classes/wishes/${id}`)))
	.then((originalWish) => {
		console.log('success', originalWish)
		if (userMail !== originalWish.data.created.by) {
			return {
				statusCode: 401,
				body: "Unauthorized"
			};
		}
		return client
		.query(query.Delete(query.Ref(`classes/wishes/${id}`)))
		.then((response) => {
			console.log('success', response)
			return {
				statusCode: 200,
				body: JSON.stringify(response),
			}
		})
		.catch((error) => {
			console.log('error', error)
			return {
				statusCode: 400,
				body: JSON.stringify(error),
			}
		})
	})
	.catch((error) => {
		console.log('error', error)
		return {
			statusCode: 400,
			body: JSON.stringify(error),
		}
	});
}

module.exports = { handler }
