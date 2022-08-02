import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { Table, Thead, Tbody, Tr, Td, Th } from '@strapi/design-system/Table';
import {
  ModalLayout,
  ModalHeader,
  ModalFooter,
  ModalBody
} from '@strapi/design-system/ModalLayout';
import { Stack } from '@strapi/design-system/Stack';
import { Divider } from '@strapi/design-system/Divider';
import { Textarea } from '@strapi/design-system/Textarea';
import { Button } from '@strapi/design-system/Button';
import { Typography, TextButton } from '@strapi/design-system/Typography';
import { Box } from "@strapi/design-system/Box"

import Comment from "./Comment"
import axios from "../../utils/axiosInstance"
import { ISOToISO9075 } from "../../utils/date-format"

const ROW_COUNT = 6;
const COL_COUNT = 10;

const CommentsContainer = ({data, actionDelete, actionAdd}) => {
  const [comments, setComments] = useState(null)
  useEffect(() => {
    if (data) {
      const commentsJSX = data.comments.map((comment) => {
        return <CommentRow data={comment} key={comment.id} actionDelete={actionDelete} />
      })
      setComments(commentsJSX)
    }
  }, [data])
  const loadMore = async () => {
    const start = data.comments.length
    const url = `/comment-manager?start=${start}`
    try {
      const res = await axios.get(url)
      const { comments } = res.data
      actionAdd(comments)
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <>
      {
        (!data.comments || !data.comments.length) ?
          <Typography variant="beta">There are no comments yet</Typography>
        : (
          <Stack size={2}>
            <Typography variant="beta">
              Viewing {data.comments.length} of {data.commentsCount} comments
            </Typography>
            <Table colCount={COL_COUNT} rowCount={ROW_COUNT}>
              <Thead>
                <Tr>
                  <Th>
                    <Typography fontWeight="bold">ID</Typography>
                  </Th>
                  <Th>
                    <Typography fontWeight="bold">Author</Typography>
                  </Th>
                  <Th>
                    <Typography fontWeight="bold">Comment</Typography>
                  </Th>
                  <Th>
                    <Typography fontWeight="bold">Content ID</Typography>
                  </Th>
                  <Th>
                    <Typography fontWeight="bold">Date</Typography>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {comments}
              </Tbody>
            </Table>
            {
              (data.comments.length < data.commentsCount) &&
              <Button
                variant="secondary"
                onClick={loadMore}
              >Load more comments</Button>
            }
          </Stack>
        )
      }
    </>
  )
}

export default CommentsContainer

const CommentModal = ({data, close, actionDelete}) => {
  const [deleting, setDeleting] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const toggleDelModal = () => setDeleteModal(prev => !prev)
  const handleDelete = async () => {
    const url = `/comment-manager/comments/${data.id}`
    setDeleting(true)
    try {
      const res = await axios.delete(url)
      const { ok } = res.data
      if (!ok) {
        throw res
      }
      actionDelete(data.id)
    } catch(err) {
      console.log(err)
      setDeleting(false)
    }
  }

  return (
    <>
      <ModalLayout labelledBy="title" onClose={close}>
        <ModalHeader>
          <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
            {data.related_to.slug}
          </Typography>
        </ModalHeader>
        <ModalBody>
          <Comment data={data} collapseReplies={false} />
        </ModalBody>
        <ModalFooter
          startActions={<Button variant="danger" onClick={toggleDelModal}>Delete comment</Button>}
          endActions={<Button onClick={close}>Finish</Button>}
        />
      </ModalLayout>
      {
        deleteModal &&
        <ModalLayout labelledBy="delete-title" onClose={toggleDelModal}>
          <ModalHeader>
            <Typography fontWeight="bold" textColor="neutral800" as="h2" id="delete-title">
              Delete comment {data.id} and associated subcomments
            </Typography>
          </ModalHeader>
          <ModalBody>
            <Box paddingBottom={6}>
              <Typography variant="beta">
                Are you sure you want to delete this comment and associated subcomments?
              </Typography>
              <Typography textColor="neutral800" as="h5">
                This action cannot be undone
              </Typography>
            </Box>
            <Stack horizontal size={4}>
              <Button onClick={() => setDeleteModal(false)}>Back</Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                loading={deleting ? true : undefined}
              >Delete</Button>
            </Stack>
          </ModalBody>
        </ModalLayout>
      }
    </>
  )
}

const CommentRow = ({ data, esRespuesta, actionDelete }) => {
  const [modalOpen, setModalOpen] = useState(false)
  let contentSummary = data.content
  if (data.content.length > 25) {
    contentSummary = data.content.slice(0, 25)
    contentSummary += "..."
  }
  const TableRow = styled(Tr)`
    &:hover {
      cursor: pointer;
      background: #d3d3d3;
    }
  `
  const closeModal = e => {
    if (e && e.stopPropagation) {
      e.stopPropagation()
    }
    setModalOpen(prev => !prev)
  }
  return (
    <TableRow onClick={() => setModalOpen(true)}>
      <Td>
        {data.id}
        {
          modalOpen &&
          <CommentModal
            data={data}
            close={closeModal}
            actionDelete={actionDelete}
          />
        }
      </Td>
      <Td>{data.from_admin ? "Admin" : data.author.username}</Td>
      <Td>{contentSummary}</Td>
      <Td>{data.related_to.slug}</Td>
      <Td>{ISOToISO9075(data.createdAt)}</Td>
    </TableRow>
  )
}

