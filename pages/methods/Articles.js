import { strict } from "assert";

Meteor.methods({
    'article.publish'(article, user) {
        const timeStamp = new Date().getTime();
        const obj = {
            title: article.title,
            content: article.content,
            thumbsUp: [],
            comments: Comments.insert({list: []}),
            user: user,
            createdAt: timeStamp,
            updatedAt: timeStamp,
            changeHistory: [],
        };
        const aid = Articles.insert(obj);

        const newMessage = {
            content: `我刚刚发布了新文章<br/><a style="margin-top: 20px;" href="${Meteor.settings.public.pagesUrl}/article/viewer/${aid}">${article.title}</a>`,
            tags: [],
            thumbsUp: [],
            comments: obj.comments,
            user: user,
            createdAt: timeStamp,
            updatedAt: timeStamp,
            changeHistory: [],
            article: aid,
        };
        const mid = Messages.insert(newMessage);
        Meteor.users.update({_id: user}, {$addToSet: {'profile.articles': aid, 'profile.messages': mid}});
        return {
            aid,
            mid,
            path: `/article/viewer/${aid}`
        };
    },
    'article.delete'(aid) {
        const atc = Articles.findOne(aid);
        const msg = Messages.findOne({comments: atc.comments});
        Meteor.users.update({_id: atc.user}, {
            $pull: {
                'profile.messages': msg._id,
                'profile.articles': aid,
            },
            $addToSet: {
                'profile.articlesDropped': aid
            }
        });
        return aid;
    },
});
