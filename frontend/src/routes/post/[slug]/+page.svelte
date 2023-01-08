<script>
// @ts-nocheck

  import DownvoteIconSmall from '../../../components/post/DownvoteIconSmall.svelte';
  import UpvoteIconSmall from '../../../components/post/UpvoteIconSmall.svelte';
  import CommentIcon from '../../../components/common/CommentIcon.svelte';
  	import CloseIcon from '../../../components/common/CloseIcon.svelte';
	import DownArrow from "../../../components/common/DownArrow.svelte";
	import SampleProfilePicture from "../../../components/common/SampleProfilePicture.svelte";
	import UpArrow from "../../../components/common/UpArrow.svelte";
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	dayjs.extend(relativeTime)

	export let data;

	const post = data["post"]
	const title = post.title;
	const body = post.content;
	const numOfComments = post._count.comments;
	const numOfUpvotes = post._count.upvotes;
	const comments = post.comments;
	const dateCreated = post.dateCreated;
	const author = post.author.username;

	export let comment = "";
	const submitComment = async()=>{
		const res = await fetch("http://localhost:3000/post/1/comment?authorId=1", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
    			"content": comment
			})
		});
		if(res.ok){
			location.reload()
		} else {
			alert("Cannot submit comment")
		}
	}

</script>

<div class="w-full h-full  bg-[#717171]">
	<div class="m-auto h-full w-[952px] bg-[#B5B5B5]">
		<div class="bg-black text-white w-full py-2 px-8 flex start-end">
			<div class="ml-auto">
				<a href="/"
					><div class="flex  items-center space-x-[4px]">
						<CloseIcon/>
						<p>Close</p>
					</div>
					</a>
			</div>
		</div>

		<div class="flex flex-col space-y-[8px]">
			<div class="bg-white  min-h-[249px] flex">
				<div
					class="bg-[#F8F8F8] pt-[16px] border-r-[1px] rounded-l-lg border-[#A0A0A0] w-[45px] min-w-[45px] max-w-[45px]"
				>
					<div class="flex flex-col items-center space-y-[4px]">
						<UpArrow/>
						{numOfUpvotes}
						<DownArrow/>
					</div>
				</div>

				<div class="py-[16px] px-[32px] flex flex-col space-y-[12px]">
					<div class="flex space-x-[8px] items-center">
						<SampleProfilePicture/>

						<p class="tracking-[-0.08em] text-[12px] text-[#4B4B4B]">
							Posted by u/{author} {dayjs(dateCreated).fromNow()}
						</p>
					</div>
					<div>
						<p class="text-[24px] font-black tracking-[-0.04em]">{title}</p>
					</div>
					<div>
						<p class="text-justify">
							{body}
						</p>
					</div>
					<div class="flex space-x-[8px]">
						<CommentIcon/>
						<p>{numOfComments} Comments</p>
					</div>
				</div>
			</div>

			<div class="bg-white px-[45px] min-h-full flex flex-col space-y-[32px] py-8">
				<div class="flex space-y-[20px] flex-col">
					<form on:submit|preventDefault={submitComment}>
							<textarea
								bind:value={comment}
								class="p-2 rounded-xl w-full border-[#DEDEDE] border-[1px]"
								placeholder="Text (optional)"
								rows="4"
								name="comment"
								id="comment"
							/>
						<button class="flex" type="submit">
							<div class="ml-auto right-0">
								<div
									class="bg-[#D9D9D9] px-9 py-1 rounded-full text-[20px] font-bold tracking-tighter"
								>
									Comment
								</div>
							</div>
						</button>
					</form>
					<div class="w-full h-[2px] bg-black" />
				</div>
				{#each comments as comment}
				<div class="flex space-x-[16px]">
					<div>
						<SampleProfilePicture/>
					</div>
					<div class="flex flex-col space-y-[12px]">
						<div>
							<p>u/{comment.author.username} - {dayjs(comment.dateCreated).fromNow()}</p>
						</div>
						<div>
							<p>{comment.content}</p>
						</div>
						<div class="flex items-center space-x-[8px]">
							<div>
								<UpvoteIconSmall/>
							</div>
							<p>{numOfUpvotes}</p>
							<div>
								<DownvoteIconSmall/>
							</div>
						</div>
					</div>
				</div>
				{/each}
			</div>
		</div>
	</div>
</div>
