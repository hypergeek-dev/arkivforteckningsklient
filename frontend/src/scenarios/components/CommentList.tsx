import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { displayDateWithTimezone } from 'Common/helper';
import { NodeTypeCommentDto } from 'Models/index';
import React from 'react';

type CommentProps = {
  comments: NodeTypeCommentDto[];
};

const CommentList: React.FC<CommentProps> = ({ comments }) => {
  // 2022-11-28T12:43:02
  if (comments.length <= 0) return <></>;

  return (
    <Box sx={{ maxHeight: '50vh', overflowY: 'scroll' }}>
      <Stack spacing={2}>
        {comments.map((c) => (
          <Card
            elevation={1}
            key={`comment-${c.id}`}
            sx={{ flexShrink: 0, width: '100%' }}
          >
            <CardContent sx={{ width: '100%' }}>
              <Typography variant="h4" marginBottom={2}>{`${c.createdBy} ${
                c.createdAt && displayDateWithTimezone(c.createdAt)
              }`}</Typography>

              <Typography variant="body1" whiteSpace="normal">
                {c.comment}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};
export default CommentList;
