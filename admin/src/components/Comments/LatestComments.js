import React, { memo, useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { Box } from "@strapi/design-system/Box"
import { Typography } from '@strapi/design-system/Typography';
import axios from "../../utils/axiosInstance"
import CommentsContainer from "./CommentsContainer"

const LatestComments = () => {
  const [commentsData, setCommentsData] = useState(null)
  const [commentsJSX, setCommentsJSX] = useState(null)
  const deleteComment = id => {
    setCommentsData({
      ...commentsData,
      commentsCount: commentsData.commentsCount - 1,
      comments: commentsData.comments.filter(c => c.id !== id)
    })
  }
  useEffect(() => {
    const fetchComments = async () => {
      const url = "/comment-manager"
      const { data } = await axios.get(url)
      setCommentsData(data)
    }
    fetchComments()
  }, [])
  const addComments = comments => {
    setCommentsData({
      ...commentsData,
      comments: commentsData.comments.concat(comments)
    })
  }
  useEffect(() => {
    if (commentsData) {
      setCommentsJSX(<CommentsContainer
        data={commentsData}
        actionAdd={addComments}
        actionDelete={deleteComment}
      />)
    }
  }, [commentsData])

  return (
    <Box background="neutral0" padding={4}>
      {
        commentsJSX ?
          commentsJSX
        : <Typography variant="beta">Loading latest comments...</Typography>
      }
    </Box>
  )
}

export default LatestComments