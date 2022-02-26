
const { IgApiClient } = require('instagram-private-api');

exports.showProfile = (async (req, res) => {
    const { username, password } = req.body
    const ig = new IgApiClient();
    ig.state.generateDevice(username);


    ig.account.login(username, password).then(async (loggedInUser) => {
        if (loggedInUser) {
            var userFeed = ig.feed.user(loggedInUser.pk);
            var posts = await userFeed.items();
            var postData = [];
            for (var i = 0; i < posts.length; i++) {
                var postId = posts[i].id;
                var likeCount = posts[i].like_count;
                var likers = posts[i].likers;
                var commentCount = posts[i].comment_count;
                var top_likers = posts[i].top_likers;
                var comments = posts[i].preview_comments;
                postData.push({ post_id: postId, postCommentsCount: commentCount, postComments: comments, post_likes: likeCount, top_likers: top_likers, post_likers: likers });
            }


            const followersFeed = ig.feed.accountFollowers(loggedInUser.pk);
            const followingFeed = ig.feed.accountFollowing(loggedInUser.pk);
            const blockedFeed = ig.feed.blockedUsers(loggedInUser.pk);
            const closeFeed = ig.feed.bestFriendships(loggedInUser.pk);

            const followers = await getAllItemsFromFeed(followersFeed);

            const following = await getAllItemsFromFeed(followingFeed);

            const blocked = await getAllItemsFromFeed(blockedFeed);

            const close = await getAllItemsFromFeed(closeFeed);

            const followersUsername = new Set(followers.map(({ username }) => username));

            const notFollowingYou = following.filter(({ username }) => !followersUsername.has(username));

            var postCount = postData.length;
            var followerCount = followers.length;
            var followingCount = following.length;
            var notFollowBackCount = notFollowingYou.length;
            var blockedCount = blocked.length;
            var closeCount = close.length;
            var rec = {
                success: true,
                name: loggedInUser.username,
                profile: loggedInUser.profile_pic_url,
                account_type: loggedInUser.account_type,
                postCount,
                posts: postData,
                followerCount,
                followers: followers,
                followingCount,
                following,
                notFollowBackCount,
                notFollowBack: notFollowingYou,
                blockedCount,
                blocked_users: blocked,
                closeCount,
                Close_friend: close
            }
            res.send(rec)
        } else {
            var rec = ({
                success: false,
                message: 'Unable to login in account, Failed'
            });
            res.send(rec)
        }
    }).catch(err => {
        console.log(err);
        var rec = ({
            success: false,
            message: 'Failed',
            err: err.message
        });
        res.send(rec)
    });
    async function getAllItemsFromFeed(feed) {
        let items = [];
        do {
            items = items.concat(await feed.items());
        } while (feed.isMoreAvailable());
        return items;
    };
})

