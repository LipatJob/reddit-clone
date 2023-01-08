// @ts-nocheck
export const load = async ({url}) => {
	const getPosts = async () => {
		const sortBy = url.searchParams.get('sortBy') || "new";
		console.log(`http://localhost:3000/post?sortBy=${sortBy}`)
		const res = await fetch(`http://localhost:3000/post?sortBy=${sortBy}`, {
			method: 'GET',
		});
		const data = await res.json();
		return data;
	};
	return {
		posts: await getPosts()
	};
};
