import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import styled from "styled-components"
import { Table, Thead, Tbody, Tr, Td, Th } from '@strapi/design-system/Table';
import { Button } from '@strapi/design-system/Button';
import {
  ModalLayout,
  ModalHeader,
  ModalFooter,
  ModalBody
} from '@strapi/design-system/ModalLayout';
import { Box } from "@strapi/design-system/Box"
import { Typography } from '@strapi/design-system/Typography';
import { Stack } from '@strapi/design-system/Stack';
import axios from "../../utils/axiosInstance"
import Comment from "./Comment"

const ROW_COUNT = 6;
const COL_COUNT = 10;

const CommentsByKey = () => {
  const [commentsData, setCommentsData] = useState(null)
  const [commentsJSX, setCommentsJSX] = useState(null)
  const [currentContentID, setCurrentContentID] = useState(null)
  useEffect(() => {
    const fetchComments = async () => {
      const url = "/comment-manager/comments"
      try {
        const { data } = await axios.get(url)
        setCommentsData(data)
      } catch(err) {
        console.log(err)
      }
    }
    fetchComments()
  }, [])

  const TableRow = styled(Tr)`
    &:hover {
      cursor: pointer;
      background: #d3d3d3;
    }
  `
  useEffect(() => {
    if (commentsData) {
      const comments = commentsData.map(data => {
        const { contentID, comments } = data
        return (
          <TableRow key={contentID} onClick={() => setCurrentContentID(contentID)}>
            <Td>{contentID}</Td>
            <Td>{comments}</Td>
          </TableRow>
        )
      })
      setCommentsJSX(comments)
    }
  }, [commentsData])

  const CommentsTable = ({children}) => (
    <Table colCount={COL_COUNT} rowCount={ROW_COUNT}>
      <Thead>
        <Tr>
          <Th>
            <Typography fontWeight="bold">Content ID</Typography>
          </Th>
          <Th>
            <Typography fontWeight="bold">Comments</Typography>
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {children}
      </Tbody>
    </Table>
  )

  return (
    <Box background="neutral0" padding={4}>
    {
      commentsJSX ?
        commentsJSX.length > 0 ?
          <>
            <CommentsTable>{commentsJSX}</CommentsTable>
            {
              currentContentID &&
              <ListCommentsModal
                contentID={currentContentID}
                close={() => setCurrentContentID(null)}
              />
            }
          </>
        : <Typography variant="beta">There are no comments yet</Typography>
      : <Typography variant="beta">Loading latest comments...</Typography>
    }
    </Box>
  )
}

export default CommentsByKey

const ListCommentsModal = ({contentID, close}) => {
  const [commentsData, setCommentsData] = useState(null)
  const [commentsJSX, setCommentsJSX] = useState(null)
  const deleteComment = id => {
    setCommentsData({
      commentsCount: commentsData.commentsCount - 1,
      comments: commentsData.comments.filter(c => c.id !== id)
    })
  }
  useEffect(() => {
    const fetchComments = async () => {
      const url = `/comment-manager/comments/${contentID}`
      try {
        const { data } = await axios.get(url)
        setCommentsData(data)
      } catch(err) {
        console.log(err)
      }
    }
    fetchComments()
  }, [contentID])
  useEffect(() => {
    if (commentsData) {
      const totalComments = commentsData.comments.map(comment => {
        return (
          <Comment
            data={comment}
            collapseReplies={true}
            showDeleteButton={true}
            actionDelete={deleteComment}
            key={comment.id}
          />
        )
      })
      setCommentsJSX(totalComments)
    }
  }, [commentsData])
  const loadMore = async () => {
    const start = commentsData.comments.length
    const url = `/comment-manager/comments/${contentID}?start=${start}&ignoreCount=1`
    try {
      const { data } = await axios.get(url)
      setCommentsData({
        ...commentsData,
        comments: commentsData.comments.concat(data.comments)
      })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <ModalLayout labelledBy="comments-modal-title" onClose={close}>
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="comments-modal-title">
          Comments for {contentID}
        </Typography>
      </ModalHeader>
      <ModalBody>
        {
          (commentsJSX && commentsJSX.length) ?
            <Stack size={2}>
              {commentsJSX}
              {
                (commentsJSX.length < commentsData.commentsCount) &&
                <Button
                  variant="secondary"
                  onClick={loadMore}
                >Load more comments</Button>
              }
            </Stack>
          : <Typography variant="beta">There are no comments</Typography>
        }
      </ModalBody>
      <ModalFooter
        endActions={<Button onClick={close}>Finish</Button>}
        startActions={<></>}
      />
    </ModalLayout>
  )
}
