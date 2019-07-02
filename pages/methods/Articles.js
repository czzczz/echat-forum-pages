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
        };
        const mid = Messages.insert(newMessage);
        Meteor.users.update({_id: user}, {$addToSet: {'profile.articles': aid, 'profile.messages': mid}});
        return {
            aid,
            mid,
            path: `/article/viewer/${aid}`
        };
    },
});
