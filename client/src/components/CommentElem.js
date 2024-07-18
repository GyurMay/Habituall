import { useEffect, useState, useRef } from "react";
import habitService from "../services/habitService";
import TrashIcon from "./icons/TrashIcon";
import {FaCommentAlt, FaCommentDots, FaRegCommentAlt, FaRegCommentDots} from "react-icons/fa";

const CommentElem = props => {
    const noteId = props.noteId;

    window.onkeydown = (e) => {
        if((e.key === "Enter" && (e.ctrlKey)) || (e.key === "Enter" && e.metaKey)){
        document.querySelectorAll(".commentBox").forEach(x => {
            let focused = x.querySelector('textarea') == document.activeElement;
            console.log(document.activeElement)
            if (focused){
                x.querySelector('button').click();
                return;
            }
        })
        // e.target.parentElement.querySelector('form').submit()
        }
    };

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [showComment, setShowComment] = useState(false);
    const [currUserName, setCurrUserName] = useState('');
    const [reloadComments, setReloadComments] = useState(false);

    const commenterStyle = 'commenter ';
    const commentStyle = 'comment ';
    const deleteStyle = 'delete ';

    const getNoteComments = async (noteId) => {
        console.log(noteId);
        const resp = await habitService.getComments(noteId);
        if (!resp.ok) {
            setComments([]);
            return;
        }
        const coms = await resp.json();
        setComments(coms.comment[0]?.comments);
        setCurrUserName(coms.currUserName);
    };

    useEffect(() => {
        getNoteComments(noteId);
        return () => {
            setReloadComments(false);
        };
    }, [reloadComments]); // Only depend on reloadComments

    const submitComment = async ( commentId) => {
        // event.preventDefault();

        console.log("submitting comment", newComment);
        if(newComment.trim() === "") return;
        const resp = await habitService.comment(newComment, noteId, commentId);
        if (!resp.ok) {
            alert("error while uploading comment")
        }
        const commentObj = await resp.json();
        console.log("submitcomment commentOBj", commentObj);
        if(commentObj.modifiedCount === 0){
            alert("error while uploading comment") 
        }
        setReloadComments(true);
        setNewComment('');
    }

    const deleteComment = async (commentId) => {
        const resp = await habitService.deleteComment(commentId, noteId);
        if (!resp.ok) return;
        const delCom = await resp.json();
        setReloadComments(true); // Correct the function call
    }

    return (
        showComment ?
            <>
            <div className="commentIcon" onClick={() => setShowComment(!showComment)} ><FaRegCommentDots /></div>
            <div className="theComment">
                <div className="commentDiv link-primary mb-6 border" id={noteId}>
                    {
                    comments?.map(c => {
                      return (
                        <>
                            <div className="commentDivDiv">
                                <div className={commenterStyle}>
                                    @ {c.name}
                                </div>
                                <div className="commentDate">{c.date}</div>
                                <div className={commentStyle} id={c.commentId}>
                                    {c.comment}
                                </div>
                                <div className={deleteStyle}>
                                    {c.name === currUserName && (<TrashIcon onClick={e => deleteComment(c.commentId)} />)}
                                </div>
                            </div>
                        </>
                      )
                    })
                    }
                </div>
                <form className="commentBox block w-full" onSubmit={submitComment}>
                    <textarea placeholder="Type a comment and Enter" className="" value={newComment} onChange={e => setNewComment(e.target.value)} />
                    <button type="button" id="submit-comment" className="btn btn-secondary" value="submit" onClick={submitComment}>SUBMIT</button>
                </form>
            </div>
            </> :
            <div className="commentIcon" onClick={() => { setShowComment(!showComment); getNoteComments(noteId) }}>
                <FaCommentDots />
            </div>
    );
};

export default CommentElem;
