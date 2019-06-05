Meteor.methods({
    'user.add'(userInfo, time) {
        // console.log('user', userInfo)
        // console.log(time);
        const profile = {};
        Object.keys(userInfo).forEach(key => {
            // console.log('key', key);
            if(key !== 'password') profile[key] = userInfo[key]
        });

        profile.history = [];
        profile.history.push({
            operation: 'create',
            operator: 'admin',
            time: time,
            detail: `user created`
        });
        profile.thumbsUpMessages = [];
        profile.thumbsUpArticles = [];
        profile.comments = [];
        profile.messages = [];
        profile.messagesDropped = [];
        profile.articles = [];
        profile.articlesDropped = [];

        if(!profile.nickname) profile.nickname = profile.email;

        profile.headerImage = 'http://localhost:8088/header/?img=07983baf1b5e4d298719bde5adc69e27';

        const config = {
            email: profile.email,
            password: userInfo.password,
            profile: profile
        };


        // 创建登陆用户
        const id = Accounts.createUser(config);
        return {
            id: id,
            email: userInfo.email,
            password: userInfo.password
        };
    },
    'user.addMessage'(user, msgId) {
        const userProfile = Meteor.users.findOne({_id: user})? Meteor.users.findOne({_id: user}).profile: undefined;
        if(!userProfile) return false;
        let messageList = userProfile.messages;

        if(!messageList) {
            messageList = [msgId];
            return Meteor.users.update({_id: user}, {$set: {'profile.messages': messageList}});
        }
        else return Meteor.users.update({_id: user}, {$addToSet: {'profile.messages': msgId}})
    },
    'user.dropMessage'(user, msgId) {
        const userProfile = Meteor.users.findOne({_id: user})? Meteor.users.findOne({_id: user}).profile: undefined;
        if(!userProfile) return null;

        let droppedMessageList = userProfile.messagesDropped;

        if(!droppedMessageList) {
            droppedMessageList = [{id: msgId, time: new Date().getTime()}];
            return Meteor.users.update({_id: user},
                {$set: {'profile.messagesDropped': droppedMessageList}, $pull: {'profile.messages': msgId}});
        }

        else return Meteor.users.update({_id: user},
            {$addToSet: {'profile.messagesDropped': {id: msgId, time: new Date().getTime()}}, $pull: {'profile.messages': msgId}});
    },
    'user.thumbsUpMessage'(user, msgId) {
        return Meteor.users.update(user, {$addToSet: {'profile.thumbsUpMessages': {id: msgId, time: new Date().getTime()}}});
    },
    'user.thumbsUpArticle'(user, atcId) {
        return Meteor.users.update(user, {$addToSet: {'profile.thumbsUpMessages': {id: atcId, time: new Date().getTime()}}});
    },
    'user.commentInMessage'(user, msgId, target, comment) {
        return Meteor.users.update(user, {$addToSet: {'profile.comments': {
            messageId: msgId,
            target: target,
            comment: comment,
        }}});
    }
});