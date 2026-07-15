"""Initial schema

Revision ID: 1a2b3c4d5e6f
Revises: 
Create Date: 2026-07-12 15:47:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '1a2b3c4d5e6f'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table('users',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('username', sa.String(), nullable=False),
        sa.Column('password_hash', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)

    op.create_table('leads',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=True),
        sa.Column('mobile_number', sa.String(), nullable=False),
        sa.Column('consent_given', sa.Boolean(), nullable=False),
        sa.Column('call_status', sa.Enum('new', 'interested', 'follow_up', 'joined', 'not_interested', name='callstatus'), nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_leads_id'), 'leads', ['id'], unique=False)
    op.create_index(op.f('ix_leads_mobile_number'), 'leads', ['mobile_number'], unique=True)

    op.create_table('transformations',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('goal', sa.String(), nullable=False),
        sa.Column('gender', sa.String(), nullable=False),
        sa.Column('before_image_url', sa.String(), nullable=False),
        sa.Column('after_image_url', sa.String(), nullable=False),
        sa.Column('story', sa.Text(), nullable=False),
        sa.Column('consent_given', sa.Boolean(), nullable=False),
        sa.Column('is_published', sa.Boolean(), nullable=False),
        sa.Column('views', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_transformations_id'), 'transformations', ['id'], unique=False)

    op.create_table('testimonials',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('rating', sa.Integer(), nullable=False),
        sa.Column('text', sa.Text(), nullable=False),
        sa.Column('photo_url', sa.String(), nullable=True),
        sa.Column('video_url', sa.String(), nullable=True),
        sa.Column('consent_given', sa.Boolean(), nullable=False),
        sa.Column('is_published', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_testimonials_id'), 'testimonials', ['id'], unique=False)

def downgrade():
    op.drop_index(op.f('ix_testimonials_id'), table_name='testimonials')
    op.drop_table('testimonials')
    op.drop_index(op.f('ix_transformations_id'), table_name='transformations')
    op.drop_table('transformations')
    op.drop_index(op.f('ix_leads_mobile_number'), table_name='leads')
    op.drop_index(op.f('ix_leads_id'), table_name='leads')
    op.drop_table('leads')
    op.drop_index(op.f('ix_users_username'), table_name='users')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_table('users')
    sa.Enum(name='callstatus').drop(op.get_bind(), checkfirst=False)
