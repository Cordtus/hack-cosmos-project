import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Trash2, GripVertical, AlertCircle, Send } from 'lucide-react';

interface Message {
  id: string;
  type: string;
  data: any;
}

interface BatchTxBuilderProps {
  messages: Message[];
  onChange: (messages: Message[]) => void;
  availableMessageTypes?: Array<{ value: string; label: string }>;
  onSubmit?: () => void;
  maxMessages?: number;
}

function SortableMessage({
  message,
  index,
  onRemove,
}: {
  message: Message;
  index: number;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: message.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-3 bg-muted rounded-md"
    >
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline" className="text-xs">
            #{index + 1}
          </Badge>
          <span className="text-sm font-medium truncate">{message.type}</span>
        </div>
        <div className="text-xs text-muted-foreground font-mono truncate">
          {JSON.stringify(message.data).slice(0, 100)}...
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function BatchTxBuilder({
  messages,
  onChange,
  availableMessageTypes = [],
  onSubmit,
  maxMessages = 10,
}: BatchTxBuilderProps) {
  const [selectedType, setSelectedType] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = messages.findIndex((m) => m.id === active.id);
      const newIndex = messages.findIndex((m) => m.id === over.id);

      onChange(arrayMove(messages, oldIndex, newIndex));
    }
  };

  const addMessage = () => {
    if (!selectedType) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      type: selectedType,
      data: {},
    };

    onChange([...messages, newMessage]);
    setSelectedType('');
  };

  const removeMessage = (id: string) => {
    onChange(messages.filter((m) => m.id !== id));
  };

  const canAddMore = messages.length < maxMessages;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Batch Transaction Builder</span>
          <Badge variant="outline">
            {messages.length} / {maxMessages} messages
          </Badge>
        </CardTitle>
        <CardDescription>
          Build and order multiple messages in a single transaction
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Add message section */}
        <div className="space-y-2">
          <Label>Add Message</Label>
          <div className="flex gap-2">
            <Select
              value={selectedType}
              onValueChange={setSelectedType}
              disabled={!canAddMore}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select message type..." />
              </SelectTrigger>
              <SelectContent>
                {availableMessageTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={addMessage}
              disabled={!selectedType || !canAddMore}
              size="icon"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {!canAddMore && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Maximum number of messages ({maxMessages}) reached
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Messages list */}
        {messages.length > 0 && (
          <div className="space-y-2">
            <Label>Messages (drag to reorder)</Label>
            <ScrollArea className="h-[400px] pr-4">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={messages.map((m) => m.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {messages.map((message, index) => (
                      <SortableMessage
                        key={message.id}
                        message={message}
                        index={index}
                        onRemove={() => removeMessage(message.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </ScrollArea>
          </div>
        )}

        {messages.length === 0 && (
          <Alert>
            <AlertDescription>
              No messages added yet. Select a message type above to get started.
            </AlertDescription>
          </Alert>
        )}

        {/* Submit button */}
        {onSubmit && messages.length > 0 && (
          <Button onClick={onSubmit} className="w-full" size="lg">
            <Send className="h-4 w-4 mr-2" />
            Submit {messages.length} Message{messages.length !== 1 ? 's' : ''}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
