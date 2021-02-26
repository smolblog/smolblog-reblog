import { TextControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { InnerBlocks } from '@wordpress/block-editor';
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @author Smolblog
 * @since 0.1.0
 * @link https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 * @param {Object} [props] Properties passed from the editor.
 * @return {WPElement} Element to render.
 */
export default function Edit( props ) {
	const {
		attributes: {
			sourceUrl,
			showEmbed,
			title,
		},
		className,
		setAttributes,
		isSelected,
	} = props;

	// Update field content on change.
	const onChangeContent = ( newUrl ) => {
		setAttributes( {
			sourceUrl: newUrl,
		} );
	};

	const onChangeTitle = ( newTitle ) => {
		setAttributes( { title: newTitle } );
		wp.data.dispatch('core/editor').editPost({title: newTitle});
	}

	const hasLink = '' !== sourceUrl;
	if ( ! title ) {
		setAttributes( { title: wp.data.select('core/editor').getEditedPostAttribute('title') } );
	}

	return (
		<div className={ className }>
			<TextControl
				label={ __( 'Post Link', 'reblog' ) }
				value={ sourceUrl }
				onChange={ onChangeContent }
			/>
			{ isSelected && hasLink && (
				<ToggleControl
					label="Embed link in post"
					checked={ showEmbed }
					onChange={ () => setAttributes( { showEmbed: ! showEmbed } ) }
				/>
			) }
			{ showEmbed ? (
				<InnerBlocks
					allowedBlocks={['core/embed']}
					template={[['core/embed', {url: sourceUrl}]]}
					templateLock="all"
				/>
			) : (
				<TextControl
					label={ __( 'Link Text', 'reblog' ) }
					value={ title }
					onChange={ onChangeTitle }
				/>
			) }
		</div>
	);
}
