export const load = async () => {
	const getPosts = async () => {
		const res = await fetch('http://localhost:3000/post', {
			method: 'GET',
		});
		const data = await res.json();
		return data;
	};
	return {
		posts: await getPosts()
	};
};
