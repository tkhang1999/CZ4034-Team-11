import pandas as pd
import traceback
dataset = pd.read_csv("random_tweets.csv")
filename = "nontoxic_tweets.csv"
neutral_tweets = set()
columns="id,conversation_id,created_at,date,time,timezone,user_id,username,name,place,tweet,language,mentions,urls,photos,replies_count,retweets_count,likes_count,hashtags,cashtags,link,retweet,quote_url,video,thumbnail,near,geo,source,user_rt_id,user_rt,retweet_id,reply_to,retweet_date,translate,trans_src,trans_dest,toxic,severe_toxic,subjectivity".split(",")
df = pd.DataFrame(columns=columns)

try:
    with open(filename, "r") as f:
        df = pd.read_csv(filename)[columns]
        neutral_tweets = set(df["tweet"].tolist())
except IOError as e:
    pass
try:
    with open(filename, "a+") as f:
        print(len(df))
        while len(neutral_tweets) < 500:
            sample = dataset.sample(1)
            if sample['tweet'].tolist()[0] in neutral_tweets:
                continue
            print(sample.tweet.tolist()[0])
            print("toxic? (0:n/1:y): ", end="")
            toxic = int(input())
            if toxic != 1:
                sample["toxic"] = 0
                sample["severe_toxic"] = 0
            else: continue
            print("subjectivity? (0:y/1:n): ", end="")
            subjectivity = int(input())
            if subjectivity == 0:
                sample["subjectivity"] = 0
            else: sample["subjectivity"] = 1
            df = df.append(sample, ignore_index=True)
            neutral_tweets.add(sample["tweet"].tolist()[0])
            print(len(df))
except:
    traceback.print_exc()
finally:
    df.to_csv(filename, index=False)
            
            
            
        
    
