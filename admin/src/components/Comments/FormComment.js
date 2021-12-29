import React, { useState } from "react"
import axios from "../../utils/axiosInstance"

const FormComment = (props) => {
  const { addComment, contentID } = props
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
    const url = `comment-manager/comments/${contentID}`
    setSending(true)
    try {
      const res = await axios.post(url, JSON.stringify({ content }))
      const { id } = res.data
      if (!id) {
        throw res
      }
      // Actualizar lista de preguntas para incluir la nueva del usuario.
      const newComment = {
        id,
        content
      }
      addComment(newComment)
      setContent("")
    } catch(err) {
      console.log(err)
    } finally {
      setSending(false)
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="comment-content">
          Make a comment
        </label>
        <textarea
          id="comment-content"
          rows="3"
          onChange={handleInput}
          value={content}
          required
        ></textarea>
      </div>
      <div>
        <button
          type="submit"
          disabled={sending ? "disabled" : undefined}
        >{sending ? "Sending..." : "Submit"}</button>
      </div>
    </form>
  )
}
