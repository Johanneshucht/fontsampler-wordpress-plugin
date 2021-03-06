<?php if ( empty( $font['id'] ) ) : ?>
	<h1>Nothing selected to delete.</h1>
<?php else : ?>
	<?php // TODO check and list if this font is in use in any fontsamplers ?>
	<h1>Do you really want to delete the Fontset <?php echo $font['name']; ?>?</h1>
	<form method="post" action="?page=fontsampler&amp;subpage=fonts">
		<input type="hidden" name="action" value="delete_font">
		<?php if ( function_exists( 'wp_nonce_field' ) ) : wp_nonce_field( 'fontsampler-action-delete_font' ); endif; ?>
		<?php if ( ! empty( $font['id'] ) ) : ?><input type="hidden" name="id" value="<?php echo $font['id']; ?>"><?php endif; ?>

		<?php submit_button( 'Yes, delete' ); ?>
	</form>
	<p><a href="?page=fontsampler">Back without deleting.</a></p>
<?php endif; ?>
