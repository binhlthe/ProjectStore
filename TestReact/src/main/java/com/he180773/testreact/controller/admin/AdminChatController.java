package com.he180773.testreact.controller.admin;

import com.he180773.testreact.dto.ChatUserDTO;
import com.he180773.testreact.entity.Message;
import com.he180773.testreact.entity.User;
import com.he180773.testreact.repository.MessageRepository;
import com.he180773.testreact.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/chat")
public class AdminChatController {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private SimpMessagingTemplate messagingTemplate;

    public AdminChatController(MessageRepository messageRepository, UserRepository userRepository, SimpMessagingTemplate messagingTemplate) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping("/chat-users")
    public List<ChatUserDTO> getAllUsersChattedWithAdmin() {
        List<Long> userIds= messageRepository.findDistinctChatUsers("admin");
        List<ChatUserDTO> result = new ArrayList<>();

        for (Long userId : userIds) {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) continue;

            User user = userOpt.get();
            ChatUserDTO dto = new ChatUserDTO();
            dto.setUserId(user.getId().toString());
            dto.setUserName(user.getName());
            dto.setAvatar(user.getAvatar());

            List<Message> lastMsgList = messageRepository.findLastMessageWithAdmin(userId.toString(), PageRequest.of(0, 1));
            if (!lastMsgList.isEmpty()) {
                Message lastMsg = lastMsgList.get(0);
                dto.setLastMessage(lastMsg.getContent());
                dto.setLastSentAt(lastMsg.getSentAt());
            }

            result.add(dto);
        }
        result.sort((a, b) -> {
            if (a.getLastSentAt() == null && b.getLastSentAt() == null) return 0;
            if (a.getLastSentAt() == null) return 1;
            if (b.getLastSentAt() == null) return -1;
            return b.getLastSentAt().compareTo(a.getLastSentAt());
        });

        return result;
    }

    @GetMapping("/all-users")
    public List<ChatUserDTO> getAllUsersChatted() {
        List<User> users= userRepository.findAll();
        List<ChatUserDTO> result = new ArrayList<>();
        for (User user : users) {
            ChatUserDTO dto = new ChatUserDTO();
            dto.setUserId(user.getId().toString());
            dto.setUserName(user.getName());
            dto.setAvatar(user.getAvatar());
            result.add(dto);
        }
        return result;
    }

    @GetMapping("/search-users")
    public List<ChatUserDTO> searchUsers(@RequestParam("keyword") String keyword) {
        List<User> users= userRepository.searchAllByNameContains(keyword);

        List<ChatUserDTO> result = new ArrayList<>();
        for (User user : users) {
            ChatUserDTO dto = new ChatUserDTO();
            dto.setUserId(user.getId().toString());
            dto.setUserName(user.getName());
            dto.setAvatar(user.getAvatar());
            result.add(dto);
        }
        return result;
    }


    @GetMapping("/adminMessages/{userId}")
    public List<Message> getMessagesWithUser(@PathVariable String userId) {
        String chatroomId = generateChatroomId(userId, "admin");
        System.out.println("chatroomId: "+chatroomId);
        List<Message> ms = messageRepository.findByChatRoomIdOrderBySentAtAsc(chatroomId);
        for (Message m : ms) {
            System.out.println("Status: "+"id "+m.getStatus());
        }
        return ms;
    }

    private String generateChatroomId(String userId1, String userId2) {
        return userId1.compareTo(userId2) < 0 ? userId1 + "-" + userId2 : userId2 + "-" + userId1;
    }

    @GetMapping("/clientMessages/{userId}")
    public List<Message> getClientMessages(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("sentAt").descending());
        return messageRepository.findBySenderIdOrReceiverId(userId, userId,pageable).getContent();
    }

    @PostMapping("/markAsRead")
    public ResponseEntity<Void> markAsRead(@RequestBody Map<String, Object> payload) {
        System.out.println("payload: "+payload);
        System.out.println("MessageId: "+payload.get("messageId"));
        System.out.println("UserId: "+payload.get("userId"));
        Long messageId = Long.parseLong(payload.get("messageId").toString());
        String currentUserId = payload.get("userId").toString();

        Optional<Message> optionalMessage = messageRepository.findById(messageId);
        if (optionalMessage.isEmpty()) return ResponseEntity.notFound().build();

        Message message = optionalMessage.get();
        Message saved = new Message();
        System.out.println("SenderId: "+message.getSenderId());
        System.out.println(!message.getSenderId().equals("admin"));

        // Chỉ update nếu currentUser là người nhận và chưa đọc
        if(message.getSenderId().equals("admin")) {
            System.out.println("hihihihii");
            if (message.getReceiverId().equals(currentUserId) && !"READ".equals(message.getStatus())) {
                System.out.println("hihi");
                message.setStatus("READ");
                saved=messageRepository.save(message);
                messagingTemplate.convertAndSend(
                        "/topic/message-read/" + message.getReceiverId(),
                        saved
                );

            }
        } else{
            System.out.println("hihiih: "+!"READ".equals(message.getStatus()));
            if(!"READ".equals(message.getStatus())){
                System.out.println("hehe");
                message.setStatus("READ");
                saved=messageRepository.save(message);

                messagingTemplate.convertAndSendToUser(
                        String.valueOf(message.getSenderId()),
                        "/queue/message-read",
                        saved
                );
            }
        }





        return ResponseEntity.ok().build();
    }



}
