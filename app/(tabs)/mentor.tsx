import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, SafeAreaView, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import LottieView from 'lottie-react-native';
import { useFastingStore } from '@/store/useFastingStore';
import { getMentorResponse } from '@/services/geminiService';
import { speak } from '@/services/speechService';
import { MentorMessage } from '@/types';
import { theme } from '@/styles/theme';
import { MILESTONES } from '@/constants';

const getInitialMessage = (fastingState: string, startTime: number | null): string => {
    if (fastingState !== 'active' || !startTime) {
        return 'Welcome. How can I support your ritual today?';
    }
    const hoursElapsed = (Date.now() - startTime) / (1000 * 60 * 60);
    const currentMilestone = MILESTONES.slice().reverse().find(m => hoursElapsed >= m.hour);

    if (currentMilestone) {
        return `You are in the stage of "${currentMilestone.name}". What clarity are you seeking?`;
    }
    return 'The ritual has just begun. What is your intention for this fast?';
}

const MentorScreen = () => {
  const { state: fastingState, startTime } = useFastingStore();
  const [messages, setMessages] = useState<MentorMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setMessages([{ id: 1, text: getInitialMessage(fastingState, startTime), sender: 'mentor' }]);
  }, [fastingState, startTime]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: MentorMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const loadingMessage: MentorMessage = { id: Date.now() + 1, text: '...', sender: 'mentor', isLoading: true };
    setMessages(prev => [...prev, loadingMessage]);
    
    const fastingHours = startTime ? (Date.now() - startTime) / (1000 * 60 * 60) : 0;
    
    if (fastingState !== 'active') {
        const reply = "Begin a fast to speak with me. I am here to guide you on your journey.";
        setMessages(prev => prev.slice(0, -1).concat({ id: Date.now() + 1, text: reply, sender: 'mentor' }));
        speak(reply);
        setIsLoading(false);
        return;
    }

    const mentorReply = await getMentorResponse(input, fastingHours);
    
    setMessages(prev => prev.slice(0, -1).concat({ id: Date.now() + 1, text: mentorReply, sender: 'mentor' }));
    speak(mentorReply);
    setIsLoading(false);
  };
  
  const renderMessage = ({ item }: { item: MentorMessage }) => {
    const isUser = item.sender === 'user';
    return (
        <View style={[styles.messageContainer, isUser ? styles.userMessageContainer : styles.mentorMessageContainer]}>
            <View style={[styles.messageBubble, isUser ? styles.userMessageBubble : styles.mentorMessageBubble]}>
                {item.isLoading ? (
                    <ActivityIndicator size="small" color={theme.colors.onSurface} />
                ) : (
                    <Text style={isUser ? styles.userMessageText : styles.mentorMessageText}>{item.text}</Text>
                )}
            </View>
        </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
        <LottieView
            source={{ uri: 'https://assets3.lottiefiles.com/packages/lf20_nw1ssb8k.json' }}
            autoPlay
            loop
            speed={0.2}
            style={styles.backgroundLottie}
        />
        <KeyboardAvoidingView 
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={100}
        >
            <Text style={styles.title}>The Oracle's Chamber</Text>
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id.toString()}
                style={styles.messageList}
                contentContainerStyle={{ padding: theme.spacing.medium }}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Ask for guidance..."
                    placeholderTextColor={theme.colors.onSurfaceFaded}
                    editable={!isLoading}
                />
                <Pressable onPress={handleSend} disabled={isLoading} style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.base },
  backgroundLottie: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.05,
  },
  keyboardAvoidingView: { flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.onBase, textAlign: 'center', padding: theme.spacing.medium },
  messageList: { flex: 1 },
  messageContainer: { flexDirection: 'row', marginVertical: theme.spacing.small },
  userMessageContainer: { justifyContent: 'flex-end' },
  mentorMessageContainer: { justifyContent: 'flex-start' },
  messageBubble: { borderRadius: theme.borderRadius.large, padding: theme.spacing.medium, maxWidth: '80%' },
  userMessageBubble: { backgroundColor: theme.colors.primary, },
  mentorMessageBubble: { backgroundColor: theme.colors.surface },
  userMessageText: { color: theme.colors.base, fontSize: 16 },
  mentorMessageText: { color: theme.colors.onSurface, fontSize: 16 },
  inputContainer: { flexDirection: 'row', padding: theme.spacing.medium, borderTopWidth: 1, borderTopColor: theme.colors.surface, backgroundColor: theme.colors.base },
  input: { flex: 1, backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.large, paddingHorizontal: theme.spacing.medium, paddingVertical: theme.spacing.small, color: theme.colors.onSurface, fontSize: 16 },
  sendButton: { backgroundColor: theme.colors.primary, paddingHorizontal: theme.spacing.large, justifyContent: 'center', alignItems: 'center', borderRadius: theme.borderRadius.large, marginLeft: theme.spacing.medium },
  sendButtonDisabled: { opacity: 0.5 },
  sendButtonText: { color: theme.colors.base, fontWeight: 'bold' }
});


export default MentorScreen;
