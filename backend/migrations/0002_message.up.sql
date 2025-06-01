CREATE TABLE IF NOT EXISTS messages
(
    id        UUID PRIMARY KEY                  DEFAULT gen_random_uuid(),
    sender_id UUID                     NOT NULL,
    content   TEXT                     NOT NULL,
    sent_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_sender
        FOREIGN KEY (sender_id)
            REFERENCES users (id)
            ON DELETE CASCADE
);

-- Create index on sender_id for faster lookups of messages by sender
CREATE INDEX idx_messages_sender_id ON messages (sender_id);