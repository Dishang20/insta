const { IgApiClient } = require('instagram-private-api');
const instaUser = require('../models/instaModel')
const catchError = require('../middleware/catchError');
const request = require('request');
exports.getAuthCode = (async (req, res, next) => {
    const INSTA_APP_ID = process.env.INSTA_APP_ID
    const INSTA_REDIRECT_URI = process.env.INSTA_REDIRECT_URI
    console.log(INSTA_REDIRECT_URI);
    console.log(INSTA_APP_ID);
    return res.send(
        `<a href='https://api.instagram.com/oauth/authorize?client_id=${INSTA_APP_ID}&redirect_uri=${INSTA_REDIRECT_URI}&scope=user_media,user_profile&response_type=code'> Connect to Instagram </a>`
    );
})
exports.showProfile = catchError(async (req, res) => {
    const { username } = req.body
    const ig = new IgApiClient();
    ig.state.generateDevice(username);
    var data = ''
    // console.log(username);
    var userId = {}
    request.post(
        {
            url: "https://api.instagram.com/oauth/access_token",
            form: {
                redirect_uri: process.env.INSTA_REDIRECT_URI,
                client_id: process.env.INSTA_APP_ID,
                client_secret: process.env.INSTA_APP_SECRET,
                code: process.env.code, // "code" retrive from frontend
                grant_type: "authorization_code",
            },
        },
        function (err, httpResponse, body) {
            if (err) {
                return res.send(err)
            }
            if (httpResponse.statusCode === 200 && body) {
                var profile = JSON.parse(body);
                request.get({
                    uri: `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTA_APP_SECRET}&access_token=` + profile.access_token
                }, function (err1, resp1, body1) {
                    if (err1) {
                        return res.send(err1)
                    }
                    if (resp1 && body1) {
                        console.log('body 1', body1);
                        var access = JSON.parse(body1)
                        request.get({
                            uri: `https://graph.instagram.com/${access.user_id}?access_token=${access.access_token}&fields=id,username`
                        }, function (err2, resp2, body2) {
                            if (err2) {
                                return res.send(err2)
                            }
                            if (resp2 && body2) {
                                return res.send(body2)
                            }
                        })
                    }
                })
            }

        }
    );
    request.get({
        uri: `https://www.instagram.com/${username}/?__a=1`
    }, function (err, response, body) {
        if (err) {
            return res.send({
                err: err
            })
        }
        var id;
        if (response.statusCode === 200 && body) {
            id = JSON.parse(body)
            data = id.logging_page_id
        }
        var pkId = data.substring(12)
        console.log(pkId);
        // res.send(id)
    })

    // ig.account.login(username, password).then(async (loggedInUser) => {
    //     if (loggedInUser) {
    // instaUser.findOne({ pk: loggedInUser.pk })
    //     .then(saved => {
    //         if (saved) {
    //             console.log('old user');
    //             // return pk = saved.pk
    //         } else {
    //             instaUser.create({
    //                 pk: loggedInUser.pk,
    //                 username: loggedInUser.username
    //             }).then(registerNew => {
    //                 console.log('new user');
    //             }).catch(err => {
    //                 res.send({
    //                     success: false,
    //                     message: err.message
    //                 })
    //             })
    //         }
    //     }).catch(err => {
    //         res.send({
    //             success: false,
    //             message: err.message
    //         })
    //     })

    // User Profile Details
    // var userFeed = ig.feed.user(loggedInUser.pk);
    // var posts = await userFeed.items();

    // Post Details Filter
    // var postData = [];
    // for (var i = 0; i < posts.length; i++) {
    //     var postId = posts[i].id;
    //     var likeCount = posts[i].like_count;
    //     var likers = posts[i].likers;
    //     var commentCount = posts[i].comment_count;
    //     var top_likers = posts[i].top_likers;
    //     var comments = posts[i].preview_comments;
    //     postData.push({ post_id: postId, postCommentsCount: commentCount, postComments: comments, post_likes: likeCount, top_likers: top_likers, post_likers: likers });
    // }

    // TODO:  All Feeds ...
    // const storyFeed = ig.feed.userStory(loggedInUser.pk)
    // const followersFeed = ig.feed.accountFollowers(loggedInUser.pk);
    // const followingFeed = ig.feed.accountFollowing(loggedInUser.pk);
    // const blockedFeed = ig.feed.blockedUsers(loggedInUser.pk);
    // const closeFeed = ig.feed.bestFriendships(loggedInUser.pk);

    // TODO: Feed Lists ...
    // const followers = await getAllItemsFromFeed(followersFeed);
    // const following = await getAllItemsFromFeed(followingFeed);
    // const story = await getAllItemsFromFeed(storyFeed);
    // const blocked = await getAllItemsFromFeed(blockedFeed);
    // const close = await getAllItemsFromFeed(closeFeed);
    // const postDetails = await getAllItemsFromFeed(userFeed);

    // Filters ...
    // const followersUsername = new Set(followers.map(({ username }) => username));
    // const notFollowingYou = following.filter(({ username }) => !followersUsername.has(username))
    // const followingUsername = new Set(following.map(({ username }) => username));
    // const meNotFollowBack = followers.filter(({ username }) => !followingUsername.has(username))
    // const mutualFollowers = (followers.filter(({ username }) => followingUsername.has(username)) && following.filter(({ username }) => followersUsername.has(username)))
    // var stroryViewers = [];
    // story.forEach(users => {
    //     stroryViewers.push(users.user.username)
    //     stroryViewers.push(users.user.username)
    // })

    // TODO: Lengths ...
    // var mutualCount = mutualFollowers.length;
    // var postCount = postData.length;
    // var followerCount = followers.length;
    // var followingCount = following.length;
    // var notFollowBackCount = notFollowingYou.length;
    // var blockedCount = blocked.length;
    // var closeCount = close.length;
    // var meNotFollowCount = meNotFollowBack.length;
    // var stroryViewersCount = stroryViewers.length;

    // TODO: Add Response ...
    // var rec = {
    //     success: true,
    //     userId: loggedInUser.pk,
    //     name: loggedInUser.username,
    //     profile: loggedInUser.profile_pic_url,
    //     account_type: loggedInUser.account_type,
    //     postCount,
    //     story,
    //     posts: postData,
    //     followerCount,
    //     followers: followers,
    //     followingCount,
    //     following,
    //     notFollowBackCount,
    //     notFollowBack: notFollowingYou,
    //     meNotFollowBack,
    //     meNotFollowCount, mutualFollowers,
    //     mutualCount,
    //     blockedCount,
    //     blocked_users: blocked,
    //     closeCount,
    //     Close_friend: close
    // }
    // res.send(rec)
    //     } else {
    //         var rec = ({
    //             success: false,
    //             message: 'Unable to login in account, Failed'
    //         });
    //         res.send(rec)
    //     }
    // }).catch(err => {
    //     console.log(err);
    //     var rec = ({
    //         success: false,
    //         message: 'Failed',
    //         err: err.message
    //     });
    //     res.send(rec)
    // });

    // TODO: Get Feeds ...
    // async function getAllItemsFromFeed(feed) {
    //     let items = [];
    //     do {
    //         items = items.concat(await feed.items());
    //     } while (feed.isMoreAvailable());
    //     return items;
    // };
})
