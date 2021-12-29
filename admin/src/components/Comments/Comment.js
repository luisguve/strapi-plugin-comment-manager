import React, { useState, useEffect, useContext } from "react"
import { Stack } from '@strapi/design-system/Stack';
import { Divider } from '@strapi/design-system/Divider';
import { Textarea } from '@strapi/design-system/Textarea';
import { Button } from '@strapi/design-system/Button';
import { Box } from "@strapi/design-system/Box"
import { Typography } from '@strapi/design-system/Typography';
import axios from "../../utils/axiosInstance"
import { ISOToFull } from "../../utils/date-format"
import {
  ModalLayout,
  ModalHeader,
  ModalFooter,
  ModalBody
} from '@strapi/design-system/ModalLayout';

const Reply = ({data, actionDelete}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const handleDelete = async () => {
    const url = `comment-manager/subcomments/${data.id}`
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
  const openDeleteModal = () => {
    setDeleteModalOpen(true)
  }
  return (
    <>
      <Box paddingTop={3}>
        <Divider />
        <Box paddingTop={3}>
          <Stack horizontal size={2}>
            <Typography fontWeight="bold">
              {
                data.from_admin ? "Admin" : data.author.username
              }
            </Typography>
            <Typography>
              {"\t"} on {ISOToFull(data.createdAt)}
            </Typography>
            <Button variant="danger" onClick={openDeleteModal}>Delete</Button>
          </Stack>
        </Box>
        <Box>
          <Typography>{data.content}</Typography>
        </Box>
      </Box>
      {
        deleteModalOpen && (
          <DeleteModal
            headerContent={`Delete subcomment ${data.id}`}
            close={() => setDeleteModalOpen(false)}
            deleting={deleting}
            handleDelete={handleDelete}
          >
            <Box paddingTop={5} paddingBottom={5}>
              <Typography variant="beta">
                Are you sure you want to delete this subcomment?
              </Typography>
              <Typography textColor="neutral800" as="h5">
                This action cannot be undone
              </Typography>
            </Box>
          </DeleteModal>
        )
      }
    </>
  )
}

const Comment = ({ data, collapseReplies, showDeleteButton, actionDelete }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(null)
  const [showFormReply, setShowFormReply] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [loadingReplies, setLoadingReplies] = useState(false)
  const [showReplies, setShowReplies] = useState(collapseReplies !== true)
  const [repliesData, setRepliesData] = useState(data.subcomments)
  const deleteReply = id => {
    setRepliesData(repliesData.filter(r => r.id !== id))
  }
  const addReply = replyData => {
    setRepliesData(repliesData.concat(replyData))
  }
  const renderReplies = () => {
    if (repliesData && repliesData.length) {
      const repliesJSX = repliesData.map(replyData => {
        return <Reply
          data={replyData}
          key={replyData.id}
          actionDelete={deleteReply}
        />
      })
      return repliesJSX
    }
    return null
  }
  const [replies, setReplies] = useState(renderReplies())
  useEffect(() => {
    setReplies(renderReplies())
  }, [repliesData])
  const toggleReplies = () => {
    setShowReplies(prev => !prev)
  }
  const toggleShowFormReply = () => {
    setShowFormReply(prev => !prev)
  }
  const handleDelete = async () => {
    const url = `comment-manager/comments/${data.id}`
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
  const openDeleteModal = () => {
    setDeleteModalOpen(true)
  }
  return (
    <>
      <Box paddingTop={4} paddingBottom={4}>
        <Box paddingBottom={4}>
          <Box paddingBottom={2}>
            <Stack horizontal size={2}>
              <Typography fontWeight="bold">
                Comment {data.id}:
              </Typography>
              <Typography fontWeight="bold">
                {data.from_admin ? "Admin" : data.author.username}
              </Typography>
              <Typography>
                {"\t"} on {ISOToFull(data.createdAt)}
              </Typography>
              {
                showDeleteButton &&
                <Button variant="danger" onClick={openDeleteModal}>delete</Button>
              }
            </Stack>
          </Box>
          <Box background="neutral0" borderColor="neutral200" hasRadius={true} padding={6}>
            <Typography>
              {data.content}
            </Typography>
          </Box>
        </Box>
        <Stack horizontal size={4}>
        {
          (replies && replies.length) ?
            <Box>
              <Button variant="ghost" onClick={toggleReplies}>
                {replies.length}
                {" "} {replies.length === 1 ? " reply" : " replies"}
              </Button>
            </Box>
          : <Box>0 replies</Box>
        }
          <Button variant="secondary" onClick={toggleShowFormReply}>Leave a reply</Button>
        </Stack>
        {
          showFormReply &&
            <FormReply
              commentID={data.id}
              closeForm={() => setShowFormReply(false)}
              addReply={addReply}
            />
        }
        {
          showReplies &&
          <Box paddingLeft={3}>
            {replies}
          </Box>
        }
      </Box>
      {
        deleteModalOpen && (
          <DeleteModal
            headerContent={`Delete comment ${data.id} and associated subcomments`}
            close={() => setDeleteModalOpen(false)}
            deleting={deleting}
            handleDelete={handleDelete}
          >
            <Box paddingTop={5} paddingBottom={5}>
              <Typography variant="beta">
                Are you sure you want to delete this comment and associated subcomments?
              </Typography>
              <Typography textColor="neutral800" as="h5">
                This action cannot be undone
              </Typography>
            </Box>
          </DeleteModal>
        )
      }
    </>
  )
}

export default Comment

const FormReply = ({ commentID, addReply, closeForm }) => {
  const [content, setContent] = useState("")
  const [sending, setSending] = useState(false)
  const handleInput = e => {
    setContent(e.target.value)
  }
  const handleSubmit = async e => {
    e.preventDefault()
    if (!content) {
      return
    }
    const url = `comment-manager/subcomments/${commentID}`
    setSending(true)
    try {
      const res = await axios.post(url, JSON.stringify({content}))
      const { id } = res.data
      if (!id) {
        throw res
      }
      // Add reply.
      addReply({
        id,
        content,
        createdAt: ISOToFull((new Date()).toISOString()),
        from_admin: true
      })
      closeForm()
    } catch(err) {
      console.log(err)
      setSending(false)
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <Textarea
        placeholder="Type a comment here"
        label="Your reply"
        name="content"
        error={content.length < 1 ? 'Content is too short' : undefined}
        onChange={handleInput}
      >
        {content}
      </Textarea>
      <Box paddingTop={2}>
        <Stack horizontal size={4}>
          <Button
            type="submit"
            loading={sending ? true : undefined}
          >{sending ? "Sending" : "Submit"}</Button>
          <Button
            variant="secondary"
            type="Button"
            disabled={sending ? true : undefined}
            onClick={closeForm}
          >Cancel</Button>
        </Stack>
      </Box>
    </form>
  )
}

const DeleteModal = ({headerContent, children, close, handleDelete, deleting}) => {
  return (
    <ModalLayout labelledBy="delete-title" onClose={close}>
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="delete-title">
          {headerContent}
        </Typography>
      </ModalHeader>
      <ModalBody>
        <Box paddingBottom={6}>
          {children}
        </Box>
        <Stack horizontal size={4}>
          <Button onClick={close}>Cancel</Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            loading={deleting ? true : undefined}
          >Delete</Button>
        </Stack>
      </ModalBody>
    </ModalLayout>
  )
}
