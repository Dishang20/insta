const { IgApiClient } = require('instagram-private-api');
const instaUser = require('../models/instaModel')

exports.showProfile = (async (req, res) => {
    const { username, password } = req.body
    const ig = new IgApiClient();
    ig.state.generateDevice(username);

    ig.account.login(username, password).then(async (loggedInUser) => {
        if (loggedInUser) {
            // var pk
            instaUser.findOne({ pk: loggedInUser.pk })
                .then(saved => {
                    if (saved) {
                        console.log('old user');
                        // return pk = saved.pk
                    } else {
                        instaUser.create({
                            pk: loggedInUser.pk,
                            username: loggedInUser.username
                        }).then(registerNew => {
                            console.log('new user');
                        }).catch(err => {
                            res.send({
                                success: false,
                                message: err.message
                            })
                        })
                    }
                }).catch(err => {
                    res.send({
                        success: false,
                        message: err.message
                    })
                })

            // console.log(loggedInUser.pk);
            //// user profile details
            var userFeed = ig.feed.user(loggedInUser.pk);
            var posts = await userFeed.items();

            //// post details filter
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

            //// all feeds
            const storyFeed = ig.feed.userStory(loggedInUser.pk)
            const followersFeed = ig.feed.accountFollowers(loggedInUser.pk);
            const followingFeed = ig.feed.accountFollowing(loggedInUser.pk);
            const blockedFeed = ig.feed.blockedUsers(loggedInUser.pk);
            const closeFeed = ig.feed.bestFriendships(loggedInUser.pk);

            /// feed lists
            const followers = await getAllItemsFromFeed(followersFeed);
            const following = await getAllItemsFromFeed(followingFeed);
            const story = await getAllItemsFromFeed(storyFeed);
            const blocked = await getAllItemsFromFeed(blockedFeed);
            const close = await getAllItemsFromFeed(closeFeed);
            const postDetails = await getAllItemsFromFeed(userFeed);
            // console.log(postDetails);
            /// filters
            const followersUsername = new Set(followers.map(({ username }) => username));
            const notFollowingYou = following.filter(({ username }) => !followersUsername.has(username))
            const followingUsername = new Set(following.map(({ username }) => username));
            const meNotFollowBack = followers.filter(({ username }) => !followingUsername.has(username))
            const mutualFollowers = (followers.filter(({ username }) => followingUsername.has(username)) && following.filter(({ username }) => followersUsername.has(username)))
            var stroryViewers = [];
            story.forEach(users => {
                  stroryViewers.push(users.user.username)
            })

            /// lengths
            var mutualCount = mutualFollowers.length;
            var postCount = postData.length;
            var followerCount = followers.length;
            var followingCount = following.length;
            var notFollowBackCount = notFollowingYou.length;
            var blockedCount = blocked.length;
            var closeCount = close.length;
            var meNotFollowCount = meNotFollowBack.length;
            var stroryViewersCount = stroryViewers.length;

            //// response
            var rec = {
                success: true,
                name: loggedInUser.username,
                profile: loggedInUser.profile_pic_url,
                account_type: loggedInUser.account_type,
                postCount,
                story:stroryViewers,
                stroryViewersCount,
                posts: postData,
                followerCount,
                followers: followers,
                followingCount,
                following,
                notFollowBackCount,
                notFollowBack: notFollowingYou,
                meNotFollowBack,
                meNotFollowCount, mutualFollowers,
                mutualCount,
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
