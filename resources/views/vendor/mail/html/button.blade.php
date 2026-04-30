@props([
    'url',
    'color' => 'primary',
    'align' => 'center',
])
<table class="action" align="{{ $align }}" width="100%" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td align="{{ $align }}" style="padding: 24px 0;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td align="center" bgcolor="#7c3aed" style="border-radius: 10px;">
<a href="{{ $url }}"
   target="_blank"
   rel="noopener"
   style="display:inline-block; background-color:#7c3aed; color:#ffffff !important; font-family:Helvetica,Arial,sans-serif; font-size:16px; font-weight:700; text-decoration:none; padding:14px 40px; border-radius:10px; mso-padding-alt:0; text-align:center;">
{!! $slot !!}
</a>
</td>
</tr>
</table>
</td>
</tr>
</table>
