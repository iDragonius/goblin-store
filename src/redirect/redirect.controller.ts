import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller('redirect')
export class RedirectController {
  @Get('tg')
  redirectToTelegram(@Res() res: Response) {
    const tgUrl = 'tg://resolve?domain=DonatCocBot&start=cmd_run_3350809037';
    return res.redirect(tgUrl);
  }
}
