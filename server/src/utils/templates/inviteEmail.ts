export function inviteEmailTemplate(ownerEmail: string, inviteLink: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background:#0A0A0F;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0F;padding:40px 0;">
        <tr>
          <td align="center">
            <table width="480" cellpadding="0" cellspacing="0" style="background:#111118;border-radius:12px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
              
              <tr>
                <td style="background:#7C3AED;padding:28px 40px;text-align:center;">
                  <h1 style="margin:0;color:#F8F8FF;font-size:24px;font-weight:700;">MultiFlix</h1>
                  <p style="margin:6px 0 0;color:rgba(248,248,255,0.75);font-size:13px;">Shared billing. Independent accounts.</p>
                </td>
              </tr>

              <tr>
                <td style="padding:36px 40px;">
                  <h2 style="margin:0 0 12px;color:#F8F8FF;font-size:20px;font-weight:600;">You've been invited</h2>
                  <p style="margin:0 0 8px;color:#A0A0B0;font-size:15px;line-height:1.6;">
                    <strong style="color:#F8F8FF;">${ownerEmail}</strong> has invited you to join their MultiFlix subscription plan.
                  </p>
                  <p style="margin:0 0 28px;color:#A0A0B0;font-size:15px;line-height:1.6;">
                    You'll get your own independent account — your own login, your own profiles, completely private from other members. Billing is shared, everything else is yours.
                  </p>

                  <table cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center">
                        <a href="${inviteLink}"
                           style="display:inline-block;padding:14px 36px;background:#7C3AED;color:#F8F8FF;border-radius:8px;text-decoration:none;font-size:15px;font-weight:600;">
                          Accept Invite
                        </a>
                      </td>
                    </tr>
                  </table>

                  <table cellpadding="0" cellspacing="0" width="100%" style="margin:28px 0;">
                    <tr><td style="border-top:1px solid rgba(255,255,255,0.08);"></td></tr>
                  </table>

                  <p style="margin:0 0 12px;color:#F8F8FF;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;">What you get</p>
                  <table cellpadding="0" cellspacing="0" width="100%">
                    <tr><td style="padding:6px 0;color:#A0A0B0;font-size:14px;">✦ &nbsp; Your own login — independent from the account owner</td></tr>
                    <tr><td style="padding:6px 0;color:#A0A0B0;font-size:14px;">✦ &nbsp; Private profiles — other members can't see yours</td></tr>
                    <tr><td style="padding:6px 0;color:#A0A0B0;font-size:14px;">✦ &nbsp; Personal watchlist, watch history, and recommendations</td></tr>
                    <tr><td style="padding:6px 0;color:#A0A0B0;font-size:14px;">✦ &nbsp; Shared billing — you don't pay anything separately</td></tr>
                  </table>

                  <table cellpadding="0" cellspacing="0" width="100%" style="margin-top:28px;">
                    <tr>
                      <td style="background:#1A1A24;border-radius:8px;padding:14px 16px;">
                        <p style="margin:0 0 6px;color:#606070;font-size:12px;">Button not working? Copy this link:</p>
                        <p style="margin:0;color:#7C3AED;font-size:12px;word-break:break-all;">${inviteLink}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.08);">
                  <p style="margin:0;color:#606070;font-size:12px;line-height:1.6;text-align:center;">
                    This invite expires in 7 days. If you weren't expecting this, you can safely ignore it.<br>
                    © ${new Date().getFullYear()} MultiFlix
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
