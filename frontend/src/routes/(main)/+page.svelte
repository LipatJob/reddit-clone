<script>
// @ts-nocheck
	import SortControversialIcon from '../../components/common/SortControversialIcon.svelte';
	import SortNewIcon from '../../components/common/SortNewIcon.svelte';
	import SortBestIcon from '../../components/common/SortBestIcon.svelte';

	import Post from '../../components/main/Post.svelte';
	 export let data;
</script>
<div class="flex flex-col space-y-[16px] mt-[42px]">
	<div class="bg-white border-[1px] p-4 border-[#A0A0A0] rounded-lg">
		<div class="flex space-x-[55px]">
			<div class="flex items-center space-x-[8px]">
				<SortNewIcon/>
				<p class="font-bold text-[24px] tracking-[-0.08em]">Whats new?</p>
			</div>
			<div class="flex items-center space-x-[8px]">
				<SortBestIcon/>
				<p class="font-bold text-[24px] tracking-[-0.08em]">Best</p>
			</div>
			<div class="flex items-center space-x-[8px]">
				<SortControversialIcon/>
				<p class="font-bold text-[24px] tracking-[-0.08em]">Controversial</p>
			</div>
		</div>
	</div>
	{#each data["posts"] as post}
		<Post
			authorUsername={post.author.username}
			id={post.id}
			title={post.title}
			body={post.content}
			numOfComments={post._count.comments}
			numOfUpvotes={post._count.upvotes}
			datePosted={post.dateCreated}
		/>
	{/each}
	
</div>
