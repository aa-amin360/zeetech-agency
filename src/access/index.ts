import type { Access } from 'payload'

export const loggedIn: Access = ({ req }) => Boolean(req.user)

export const anyone: Access = () => true

/** Visitors see published documents; logged-in editors see drafts too. */
export const publishedOrLoggedIn: Access = ({ req }) =>
  req.user ? true : { _status: { equals: 'published' } }
