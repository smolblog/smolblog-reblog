import { TextControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
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
			// showEmbed,
		},
		className,
		setAttributes,
		// isSelected,
	} = props;

	// Update field content on change.
	const onChangeContent = ( newUrl ) => {
		setAttributes( {
			sourceUrl: newUrl,
			// embed: `<p><a href="${ sourceUrl }">Link source</a></p>`,
		} );
	};

	const hasLink = '' !== sourceUrl;

	return (
		<div className={ className }>
			<TextControl
				label={ __( 'Post Link', 'linkblog' ) }
				className={ className }
				value={ sourceUrl }
				onChange={ onChangeContent }
			/>
			{/* { isSelected && hasLink && (
				<ToggleControl
					label="Embed link in post"
					checked={ showEmbed }
					onChange={ () => setAttributes( { showEmbed: ! showEmbed } ) }
				/>
			) }
			{ showEmbed && (
				<div className="smolblog-linkblog-embed">
					<p><a href={ sourceUrl }>Link source</a></p>
				</div>
			) } */}
		</div>
	);
}
