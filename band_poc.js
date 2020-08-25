const axios = require("axios");
const crypto = require("crypto");
const query = require("querystring");

const MEMBER_API = {
	GET_BAND_MEMBERS: "/v1/get_band_members",
	GET_MEMBERS_OF_BAND: "/v1.3.0/get_members_of_band",
	GET_MEMBERS_OF_BAND_WITH_FILTER: "/v2.0.0/get_members_of_band_with_filter",
	GET_MEMBERS_BY_ROLE: "/v1/get_members_by_role",
	SEARCH_MEMBER: "/v1.2.0/search_member",
	SEARCH_MEMBER_IN_BAND: "/v1.1/search_member_in_band",
	SET_MEMBER_ROLE: "/v1/set_member_role",
	WITHDRAW_MEMBER: "/v1.2.0/withdraw_member",
	WITHDRAW_MEMBERS: "/v2.0.0/withdraw_members",
	GET_BLOCK_MEMBERS: "/v1.1.0/get_block_members",
	RELEASE_BLOCK_MEMBER: "/v1.0.0/release_block_member",
	GET_VIRTUAL_MEMBERS: "/v1.0.0/get_virtual_members",
	ADD_VIRTUAL_MEMBER: "/v1.0.0/add_virtual_member",
	MODIFY_VIRTUAL_MEMBER: "/v1.0.0/modify_virtual_member",
	DELETE_VIRTUAL_MEMBER: "/v1.0.0/delete_virtual_member",
	ADD_CHILD_MEMBER: "/v2.0.0/add_child_member",
	ADD_CHILD_MEMBERS: "/v2.0.0/add_child_members",
	GET_MEMBER_ACTIVITY_HISTORIES: "/v2.0.0/get_member_activity_histories",
	ADD_MEMBER_RELATION: "/v2.0.0/add_member_relation",
	REMOVE_MEMBER_RELATION: "/v2.0.0/remove_member_relation",
	GET_MUTED_MEMBERS: "/v2.0.0/get_muted_members"
};
const POST_API = {
	CREATE_POST: "/v2.0.1/create_post",
	UPDATE_POST: "/v2.0.1/update_post",
	DELETE_POST: "/v1.5.0/delete_post?version=20140508",
	DELETE_POSTS: "/v1.0.0/delete_posts",
	COPY_POST: "/v1.6.0/copy_post",
	GET_POST: "/v2.0.0/get_post",
	GET_POSTS: "/v2.0.0/get_posts",
	GET_POPULAR_POSTS: "/v2.0.0/get_popular_posts",
	GET_POSTS_ITEM: "/v2.0.0/get_posts_item",
	GET_POSTS_WITH_CREATED_AT: "/v2.0.0/get_posts_with_created_at",
	GET_POSTS_WITH_SCHEDULE: "/v2.0.0/get_posts_with_schedule",
	SEARCH_POSTS: "/v2.0.0/search_posts",
	SEARCH_FOR_POSTS_WITH_AUTHOR: "/v2.0.0/search_for_posts_with_author",
	SEARCH_MY_BANDS_FOR_MY_POSTS: "/v2.1.0/search_my_bands_for_my_posts",
	SEARCH_MY_BANDS_FOR_POSTS: "/v2.0.1/search_my_bands_for_posts",
	SEARCH_POSTS_WITH_PAGE: "/v2.0.0/search_for_posts_with_page",
	GET_HASHTAGS: "/v1.1.1/get_hashtags",
	SET_PINNED_HASHTAGS: "/v1.1.0/set_pinned_hashtags",
	SEARCH_FOR_POSTS_WITH_HASHTAG: "/v2.0.0/search_for_posts_with_hashtag",
	GET_POST_READERS: "/v1.0.0/get_post_readers",
	GET_BAND_NOTICE_READERS: "/v1.0.0/get_band_notice_readers",
	SEND_POST_EMAIL_TO_MEMBERS: "/v2.0.0/send_post_email_to_members",
	FIND_POST: "/v2.0.0/find_post",
	FIND_POSTS_ITEM: "/v2.0.1/find_posts_item",
	GET_ATTACHMENTS: "/v2.0.0/get_attachments"
};

const secret = "";
const band_session = ""; //cookie
const TEST_API = MEMBER_API.GET_MEMBERS_OF_BAND;

let param = {
	ts: Date.now(),
	band_no: 0
};

const generate_CRC = (path) => crypto.createHmac("sha256", secret).update(path).digest("base64");

let url = `${TEST_API}?${query.encode(param)}`;
(async () => {
	let res = await axios.get(`https://api.band.us/${url}`, {
		headers: {
			akey: "bbc59b0b5f7a1c6efe950f6236ccda35",
			Cookie: `band_session=${band_session};`,
			md: generate_CRC(url)
		},
		json: true
	});

	console.log(res.data);
})();
