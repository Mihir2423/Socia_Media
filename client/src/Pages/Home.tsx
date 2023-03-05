import { useQuery, gql } from "@apollo/client";
import { Grid } from "semantic-ui-react";
import PostItem from "../components/PostItem";
import PostForm from "../components/PostForm";

export const QUERY_ALL_POSTS = gql`
  query GetPosts {
    getPosts {
      username
      body
      userId
      id
      comments {
        body
        id
      }
      likes {
        createdAt
        username
        id
      }
      likeCount
      commentCount
      createdAt
    }
  }
`;
interface Like {
  createdAt: string;
  username: string;
  id: string;
}

export type PostType = {
  username: string;
  body: string;
  userId: string;
  id: string;
  likeCount: string;
  commentCount: string;
  comments: {
    body: string;
    id: string;
  };
  likes: Like[]

  createdAt: string;
};

type Props = {};

function Home({}: Props) {
  const user = localStorage.getItem("token")
  const { loading, data: posts, error, refetch } = useQuery(QUERY_ALL_POSTS);
  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
      {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {loading ? (
          <h1>Loading Posts..</h1>
        ) : (
          posts &&
          posts.getPosts.map((post: PostType) => (
            <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
              <PostItem post={post} />
            </Grid.Column>
          ))
        )}
      </Grid.Row>
    </Grid>
  );
}

export default Home;
