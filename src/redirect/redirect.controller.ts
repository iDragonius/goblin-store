import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller()
export class RedirectController {
  @Get()
  redirectToTelegram(@Res() res: Response) {
    const tgUrl = 'tg://resolve?domain=DonatCocBot&start=cmd_run_3350809037';
    return res.redirect(tgUrl);
  }
}
