import edit from './edit';
import save from './save';
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import './style.scss';

/**
 * Register block type definition.
 *
 * @author WebDevStudios
 * @since 0.0.1
 * @link https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
registerBlockType( 'smolblog/reblog', {
	title: __( 'Smolblog Reblog', 'reblog' ),
	icon: 'edit',
	category: 'common',
	keywords: [
		__( 'Smolblog', 'reblog' ),
		__( 'Reblog', 'reblog' ),
	],
	attributes: {
		sourceUrl: {
			type: 'string',
			source: 'meta',
			meta: 'smolblog_reblog_url',
		},
		showEmbed: {
			type: 'boolean',
		},
		embed: {
			type: 'string',
			source: 'html',
			selector: 'div.smolblog-reblog-embed',
		},
		title: {
			type: 'string',
		}
	},
	edit,
	save,
} );
