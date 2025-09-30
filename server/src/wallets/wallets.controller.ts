import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { UpdateWalletDto, WalletDto } from './dto/wallets.dto';

@Controller(':id/wallets')
export class WalletsController {
  constructor(private walletsService: WalletsService) {}

  @Get()
  getWallets(@Param('id') userId: string) {
    return this.walletsService.getWallets(userId);
  }

  @Get(':walletId')
  getWallet(@Param('walletId') walletId: string, @Param('id') userId: string) {
    return this.walletsService.getWallet(walletId, userId);
  }

  @Post('')
  createWallet(@Param('id') userId: string, @Body() data: WalletDto) {
    return this.walletsService.createWallet(userId, data);
  }

  @Patch(':walletId')
  updateWallet(
    @Param('walletId') walletId: string,
    @Param('id') userId: string,
    @Body() data: UpdateWalletDto
  ) {
    return this.walletsService.updateWallet(walletId, userId, data);
  }

  @Delete(':walletId')
  deleteWallet(@Param('walletId') walletId: string, @Param('id') userId: string) {
    return this.walletsService.deleteWallet(walletId, userId);
  }
}
