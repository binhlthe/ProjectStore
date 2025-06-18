package com.he180773.testreact.controller.client;

import com.he180773.testreact.dto.DepositRequestDTO;
import com.he180773.testreact.entity.User;
import com.he180773.testreact.entity.Wallet;
import com.he180773.testreact.entity.WalletTransaction;
import com.he180773.testreact.repository.WalletRepository;
import com.he180773.testreact.repository.WalletTransactionRepository;
import com.he180773.testreact.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/wallet")
@CrossOrigin(origins = "http://localhost:3000")
public class WalletController {
    private final WalletRepository walletRepository;
    private final UserService userService;
    private final WalletTransactionRepository walletTransactionRepository;

    public WalletController(WalletRepository walletRepository, UserService userService,
                            WalletTransactionRepository walletTransactionRepository) {
        this.walletRepository = walletRepository;
        this.userService = userService;
        this.walletTransactionRepository = walletTransactionRepository;
    }

    @GetMapping("/get")
    public ResponseEntity<?> getWallet(@RequestParam Long userId) {
        System.out.println("hihi: "+userId);
        Wallet wallet = walletRepository.findByUserId(userId).orElse(null);
        return ResponseEntity.ok(wallet);
    }

    @PostMapping("/handle")
    public ResponseEntity<?> createDepositRequest(@RequestBody DepositRequestDTO dto) {
        // Lưu vào DB
        System.out.println("ID: "+dto.getUserId());
        System.out.println("Created ");
        WalletTransaction walletTransaction = new WalletTransaction();
        Wallet wallet = walletRepository.findByUserId(dto.getUserId()).orElse(null);
        walletTransaction.setWalletId(wallet.getId());
        walletTransaction.setAmount(dto.getAmount());
        walletTransaction.setTransactionCode(dto.getTransactionCode());
        walletTransaction.setCreatedAt(LocalDateTime.now());
        walletTransaction.setStatus("PENDING");
        walletTransactionRepository.save(walletTransaction);
        return ResponseEntity.ok("Deposit request saved");
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserTransactions(@PathVariable Long userId) {

        Wallet wallet = walletRepository.findByUserId(userId).orElse(null);
        System.out.println("wallet: "+wallet.getId());
        return ResponseEntity.ok(walletTransactionRepository.findByWalletIdOrderByCreatedAtDesc(wallet.getId()));
    }

    @Scheduled(fixedRate = 60000) // Chạy mỗi phút
    public void removeOldPendingTransactions() {
        LocalDateTime fiveMinutesAgo = LocalDateTime.now().minusMinutes(5);
        List<WalletTransaction> oldPending = walletTransactionRepository.findByStatusAndCreatedAtBefore("PENDING", fiveMinutesAgo);

        for (WalletTransaction tx : oldPending) {
            walletTransactionRepository.delete(tx);
        }
    }

}
