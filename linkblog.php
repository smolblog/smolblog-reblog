<?php
/**
 * Plugin Name:     Smolblog Reblog
 * Description:     A starter plugin for Gutenberg blocks development.
 * Version:         0.1.0
 * Author:          Smolblog
 * License:         GPL-2.0-or-later
 * License URI:     https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     reblog
 *
 * @package         Smolblog\Reblog
 * @since           1.0.0
 */

namespace Smolblog\Reblog;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

/**
 * Register the block with WordPress.
 *
 * @author Smolblog
 * @since 0.1.0
 */
function register_block() {

	// Define our assets.
	$editor_script   = 'build/index.js';
	$editor_style    = 'build/index.css';
	$frontend_style  = 'build/style-index.css';
	$frontend_script = 'build/frontend.js';

	// Verify we have an editor script.
	if ( ! file_exists( plugin_dir_path( __FILE__ ) . $editor_script ) ) {
		wp_die( esc_html__( 'Whoops! You need to run `npm run build` for the Smolblog Reblog first.', 'reblog' ) );
	}

	// Autoload dependencies and version.
	$asset_file = require plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

	// Register editor script.
	wp_register_script(
		'smolblog-reblog-editor-script',
		plugins_url( $editor_script, __FILE__ ),
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);

	// Register editor style.
	if ( file_exists( plugin_dir_path( __FILE__ ) . $editor_style ) ) {
		wp_register_style(
			'smolblog-reblog-editor-style',
			plugins_url( $editor_style, __FILE__ ),
			[ 'wp-edit-blocks' ],
			filemtime( plugin_dir_path( __FILE__ ) . $editor_style )
		);
	}

	// Register frontend style.
	if ( file_exists( plugin_dir_path( __FILE__ ) . $frontend_style ) ) {
		wp_register_style(
			'smolblog-reblog-style',
			plugins_url( $frontend_style, __FILE__ ),
			[],
			filemtime( plugin_dir_path( __FILE__ ) . $frontend_style )
		);
	}

	// Register block with WordPress.
	register_block_type( 'smolblog/reblog', [
		'editor_script' => 'smolblog-reblog-editor-script',
		'editor_style'  => 'smolblog-reblog-editor-style',
		'style'         => 'smolblog-reblog-style',
	] );

	// Register frontend script.
	if ( file_exists( plugin_dir_path( __FILE__ ) . $frontend_script ) ) {
		wp_enqueue_script(
			'smolblog-reblog-frontend-script',
			plugins_url( $frontend_script, __FILE__ ),
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);
	}

	register_post_meta( 'post', 'smolblog_reblog_url', [
		'type'              => 'string',
		'default'           => '',
		'sanitize_callback' => 'esc_url_raw',
		'show_in_rest'      => true,
		'single'            => true,
	]);
	register_post_meta( 'post', 'smolblog_is_reblog', [
		'type'         => 'boolean',
		'default'      => false,
		'show_in_rest' => true,
		'single'       => true,
	]);
}
add_action( 'init', __NAMESPACE__ . '\register_block' );

function get_smol_link() {
	$post_id = get_the_id();
	if ( ! $post_id ) {
		return '';
	}

	$smol_link = \get_post_meta( $post_id, 'smolblog_reblog_url', true );
	return $smol_link;
}

function filter_permalink( $permalink ) {
	$smol_link = get_smol_link();
	if ( empty( $smol_link ) ) {
		return $permalink;
	}
	return $smol_link;
}
add_filter( 'the_permalink_rss', __NAMESPACE__ . '\filter_permalink', 10, 1 );

function filter_content( $content ) {
	$smol_link = get_smol_link();
	if ( empty( $smol_link ) ) {
		return $content;
	}

	$post_permalink = get_the_permalink();
	return $content . "<p><a href=\"$post_permalink\">View on blog</a></p>";
}
add_filter( 'the_content_feed', __NAMESPACE__ . '\filter_content', 10, 1 );
