import { backendAPI } from "../clientDotEnv";

const host = backendAPI;
const habitService =  {
    async createNewHabit(jsonObj){
        const resp = await fetch(host+'/api/habit/add', {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({content: jsonObj }),
            headers: {
            "Content-Type": "application/json"
            }
        });
        return resp;
    },
    async updateHabit(habitId, newHabitList){
        console.log("service", habitId, newHabitList)
        const resp = await fetch(host+"/api/habit/update/"+habitId, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({newHabit: newHabitList}),
            headers: {
                "Content-Type": "application/json"
            }
        });
        return resp;
    },
    async deleteHabit(makeHabit){
        const resp = await fetch(host+"/api/habit/delete", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({content: {makeHabit}}),
            headers: {
                "Content-Type": "application/json"
            }
        });
        return resp;
    },
    async loadNotes(makeHabit){
        const resp = await fetch(host+"/api/notes/"+makeHabit, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });
        return resp;
    },
    async createNote(noteObj, makeHabit){
        if(noteObj.note == '') noteObj.note = ' '; //temp fix
        const resp = await fetch(host+"/api/note/create", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({content: noteObj, makeHabit}),
            headers: {
                "Content-Type": "application/json"
            }
        });
        return resp;
    },
    async deleteNote(makeHabit, noteId){
        const resp = await fetch(host+"/api/note/delete", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({content: {makeHabit, noteId}}),
            headers: {
                "Content-Type": "application/json"
            }
        });
        return resp;
    },
    async search(username){
        const resp = await fetch(host+"/api/users/search", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({content: {username}}),
            headers: {
                "Content-Type": "application/json"
            }
        });
        return resp;
    },
    async getProfileInfo(username){
        console.log("getting profile info");
        const resp = await fetch(host+"/api/users/profile", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({username}),
            headers: {
                "Content-Type": "application/json"
            }
        });
        return resp;
    },
    async getForeignNotes(username, makeHabit){
        const resp = await fetch(`${host}/api/users/${username}/habits/${makeHabit}`, {
            method: "GET",
            credentials: "include",
            // body: JSON.stringify({content: {param}}),
            headers: {
                "Content-Type": "application/json"
            }
        });
        return resp;
    } ,
    async getComments(noteId){
        const resp = await fetch(host+"/api/comments/"+noteId, {
            method: "GET",
            credentials: "include",
        });
        return resp;
    },
    async comment(newComment, noteId){
        const resp = await fetch(host+"/api/comment/new", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({comment: newComment, noteId}),
            headers: {
                "Content-Type": "application/json"
            }
        });
        return resp;
    } ,
    async deleteComment(commentId, noteId){
        const resp = await fetch(host+"/api/comment/delete", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({commentId, noteId}),
            headers: {
                "Content-Type": "application/json"
            }
        });
        return resp;
    } ,
    async toggleFollow(username, followStatus){
        let followEP = (followStatus == true) ? 'unfollow' : 'follow';
        const resp = await fetch(host+"/api/user/"+username+"/"+followEP, {
        method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });
        return resp;
    } ,
    async getFeed(){
        const resp = await fetch(host+"/api/user/feed",{
            method: "GET",
            credentials: "include"
        });
        return resp;
    },
    async template(param){
        const resp = await fetch(host+"/api/habit/", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({content: {param}}),
            headers: {
                "Content-Type": "application/json"
            }
        });
        return resp;
    } 
}

export default habitService;