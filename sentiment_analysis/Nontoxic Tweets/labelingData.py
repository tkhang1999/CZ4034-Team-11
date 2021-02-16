import pandas as pd
import traceback
dataset = pd.read_csv("random_tweets_loc.csv")
filename = "random_2000_tweets_labels.csv"
neutral_tweets = set()
columns="text,created_date_time,tweet_id,username,user_screen_name,user_id,user_location,user_description,verified,associated_place,retweet_count,location,user_geo,toxic,severe_toxic,subjectivity".split(",")

df = pd.DataFrame(columns=columns)

try:
    with open(filename, "r") as f:
        df = pd.read_csv(filename)[columns]
        tweets = set(df["text"].tolist())
except IOError as e:
    pass
try:
    with open(filename, "a+") as f:
        while len(neutral_tweets) < 2000:
            print(len(df))
            sample = dataset.sample(1)
            if sample['text'].tolist()[0] in tweets:
                continue
            print(sample.text.tolist()[0])
            print("toxic? (0:n/1:y): ", end="")
            toxic = int(input())
            if toxic == 0:
                sample["toxic"] = 0
                sample["severe_toxic"] = 0
            elif toxic == 1:
                sample["toxic"] = 1
                print("severe_toxic? (0:n/1:y): ", end="")
                severe_toxic = int(input())
                if severe_toxic == 1:
                    sample["severe_toxic"] = 1
                else: sample["severe_toxic"] = 0
            else: #ignore the tweet
                continue
            #subjectivity is labeled by the sentiment analyser
            sample["subjectivity"] = 0
            df = df.append(sample, ignore_index=True)
            tweets.add(sample["text"].tolist()[0])
except:
    traceback.print_exc()
finally:
    df.to_csv(filename, index=False)
            
            
            
        
    
