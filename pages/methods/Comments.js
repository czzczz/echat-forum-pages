Meteor.methods({
    'comments.publish'(id, comment) {
        const obj = {
            content: comment.content, //评论内容
            user: comment.user, //用户
            createdAt: new Date().getTime(),// 时间
            subComments: [], // 子评论
        };
        Comments.update({_id: id}, {$addToSet: {list: obj}});
        return obj.createdAt;
    },
    'comments.comment'(id, target, comment) {
        const obj = {
            content: comment.content, //评论内容
            user: comment.user, //用户
            createdAt: new Date().getTime(),// 时间
        };
        Comments.update({
            _id: id,
            list: {$elemMatch: {
                    'user': target.user,
                    'createdAt': target.ts,
                }},
        }, {$addToSet: {
                'list.$.subComments': obj,
            }});
        return obj.createdAt;
    },
    'comments.sub2sub'(id, locate, target, comment) {
        const obj = {
            content: comment.content, //评论内容
            user: comment.user, //用户
            createdAt: new Date().getTime(),// 时间
            target: {
                user: target.user,
                ts: target.ts,
            }
        };
        Comments.update({
            _id: id,
            list: {$elemMatch: {
                    'user': locate.user,
                    'createdAt': locate.ts,
                }}
        }, {$addToSet: {
                'list.$.subComments': obj,
            }});
        return obj.createdAt;
    },
    'comments.drop'(id, type, target) {
        if(type === 'comment') {
            return Comments.update({_id: id}, {$pull: {list: {user: target.user, createdAt: target.ts}}});
        }
        else {
            const locate = target.locate;
            return Comments.update({
                _id: id,
                list: {$elemMatch: {
                        'user': locate.user,
                        'createdAt': locate.ts,
                    }}
            }, {$pull: {
                    'list.$.subComments': {user: target.user, createdAt: target.ts},
                }});
        }
    },
});
