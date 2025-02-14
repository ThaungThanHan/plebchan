import React, { useState } from "react";
import { useComment, useEditedComment } from "@plebbit/plebbit-react-hooks";
import { Link } from "react-router-dom";
import OriginalCommentModal from "./modals/OriginalCommentModal";
import getDate from "../utils/getDate";


const EditLabel = ({ commentCid, className }) => {
  const [isOriginalCommentModalOpen, setIsOriginalCommentModalOpen] = useState(false);
  const comment = useComment({commentCid});
  const timestamp = getDate(comment.edit?.timestamp);
  const {state: editedCommentState, editedComment} = useEditedComment({comment});


  const conditionsCheck = () => {
    let conditions = [];

    if (editedComment?.removed && !comment.removed) {
      conditions.push("removal");
    }
    if (editedComment?.edit && !comment.edit) {
      conditions.push("edit");
    }
    if (editedComment?.locked && !comment.locked) {
      conditions.push("lock");
    }
    if (editedComment?.pinned && !comment.pinned) {
      conditions.push("sticky");
    }

    return conditions.length > 0 ? conditions.join(', ') : null;
  };


  const conditionsString = conditionsCheck();


  return (
    <>
      <OriginalCommentModal 
        isOpen={isOriginalCommentModalOpen}
        closeModal={() => setIsOriginalCommentModalOpen(false)}
        comment={comment}/> 
      {comment.edit && (
        <>
          <br />
          <span className={className}>
            (Edited at {timestamp}, <Link className="ttl-link" onClick={
              () => setIsOriginalCommentModalOpen(true)
            }>show original</Link>)
          </span>
        </>
      )}
      {((editedCommentState === 'pending' || editedCommentState === 'failed') && conditionsString) ? (
        <>
          <br />
          <span className={className}>
            ({editedCommentState === 'pending' ? 'Pending' : 'Failed'} {conditionsString})
          </span>
        </>
      ) : null}
    </>
  );
};

export default EditLabel;