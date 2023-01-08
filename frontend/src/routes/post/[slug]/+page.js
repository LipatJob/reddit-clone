// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

export const load = async ({params}) => {
	const postId = params.slug;
	console.log(`http://localhost:3000/post/${postId}`)
    const getPost = async () => {
		const res = await fetch(`http://localhost:3000/post/${postId}`, {
			method: 'GET',
		});
		const data = await res.json();
		return data;
	};
	return {
		post: await getPost()
	};
};
