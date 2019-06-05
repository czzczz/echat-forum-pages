import axios from 'axios';

Meteor.methods({
    'message.publish'(message, user) {
        const timeStamp = new Date().getTime();
        const newMessage = {
            content: message.content,
            tags: message.tags,
            thumbsUp: [],
            comments: [],
            user: user,
            createdAt: timeStamp,
            updatedAt: timeStamp,
            changeHistory: [],
        };
        return Messages.insert(newMessage);
    },
    'message.delete'(id) {
        Messages.remove(id);
        return id;
    },
    'message.comment'(id, target, comment) {
        const ts = new Date().getTime();
        if(target.type === 'normal') {
            const comm = {
                ...comment,
                subComments: [],
                createdAt: ts,
                // id: comment.user + '-'+ ts.toString().slice(-8)
            };
            return Messages.update({_id: id}, {$addToSet: {comments: comm}});
        }
        else if(target.type === 'comment') {
            const comm = {
                ...comment,
                createdAt: ts,
                // id: comment.user + '-'+ ts.toString().slice(-8)
            };
            const newList = Messages.findOne(id).comments.map( com => {
                if(com.user === target.id.user && com.createdAt === target.id.ts) com.subComments.push(comm);
                return com;
            });
            return Messages.update({_id: id}, {$set: {comments: newList}});
        }
        else if(target.type === 'sub') {
            const comm = {
                ...comment,
                createdAt: ts,
                target: target.to,
            };
            const newList = Messages.findOne(id).comments.map( com => {
                if(com.user === target.id.user && com.createdAt === target.id.ts) com.subComments.push(comm);
                return com;
            });
            return Messages.update({_id: id}, {$set: {comments: newList}});
        }
    },
});